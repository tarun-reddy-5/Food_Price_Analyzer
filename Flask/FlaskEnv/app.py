from flask import Flask, jsonify, request
from flask_cors import CORS
import oracledb

app = Flask(__name__)
CORS(app)

# # Explicitly set CORS headers for the API route
# @app.after_request
# def after_request(response):
#     response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
#     response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
#     response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
#     return response


# Oracle DB connection details
oracle_username = ''
oracle_password = ''
oracle_host = ''
oracle_port = ''
oracle_service_name = ''

# Function to create a connection to the Oracle database


def create_connection():
    connection = oracledb.connect(
        user=oracle_username,
        password=oracle_password,
        dsn=f"{oracle_host}:{oracle_port}/{oracle_service_name}"
    )
    return connection

# Function to execute queries


def execute_query(query):
    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    connection.close()
    if len(result) == 0:
        print('Query returned no Data')

    return result


def exportImport_data_processing(results):
    processedData = []
    for lis in results:
        dic = {}
        dic['year'] = lis[0]
        dic['export'] = lis[1]
        dic['import'] = lis[2]
        dic['price'] = lis[3]
        processedData.append(dic)

    return processedData


@app.route('/api/exportImport/')
def exportImport_index():

    from_year = request.args.get('fromYear')
    to_year = request.args.get('toYear')
    country = request.args.get('country').lower()
    commodity = request.args.get('commodity').lower()

    query = f'''
    SELECT
    year,
    ROUND(AVG(export_quantity),2),
    ROUND(AVG(import_quantity),2),
    ROUND(AVG(avg_price), 2)
FROM
    (
        SELECT

        i.commodityid,
            import_quantity,
            export_quantity,
            i.countryid,
            import_unit,
            export_unit,
            i.year,
            i.avg_price

        FROM
            (
                SELECT
                    AVG(t.quantity) AS import_quantity,
                    t.commodityid,
                    t.unitofmeasurement AS import_unit,
                    t.countryid,
                    t.year,
                    t.month AS month,
                    AVG(p.pricevalue) AS avg_price
                FROM
                    trademetrics t,
                    price p
                WHERE
                    p.commodityid = t.commodityid
                    AND p.year = t.year
                    AND p.month = t.month
                    AND metrictype IN ('Imports')
                GROUP BY
                    t.commodityid,
                    t.unitofmeasurement,
                    t.countryid,
                    t.year,
                    t.month
            ) i,  -- imports data
            (
                SELECT
                    AVG(t.quantity) AS export_quantity,
                    t.commodityid,
                    t.unitofmeasurement AS export_unit,
                    t.countryid,
                    t.year,
                    t.month AS month,
                    AVG(p.pricevalue) AS avg_price
                FROM
                    trademetrics t,
                    price p
                WHERE
                    metrictype IN ('Exports')
                    AND p.commodityid = t.commodityid
                    AND p.year = t.year
                    AND p.month = t.month
                GROUP BY
                    t.commodityid,
                    t.unitofmeasurement,
                    t.countryid,
                    t.year,
                    t.month
            ) e  -- exports data
        WHERE
            i.commodityid = e.commodityid
            AND i.countryid = e.countryid
            AND i.year = e.year
            AND i.month = e.month
    ) a
WHERE
    a.countryid = (SELECT countryid FROM country WHERE LOWER(countryname) = '{country}') -- input
    AND a.year BETWEEN '{from_year}' AND '{to_year}' -- input
    AND commodityid IN (SELECT commodityid FROM commodity WHERE LOWER(commodityname) = '{commodity}') -- input
GROUP BY
    a.commodityid,
    import_unit,
    export_unit,
    a.countryid,
    a.year
ORDER BY 1
    '''

    # Execute the query
    results = execute_query(query)
    processedData = exportImport_data_processing(results)
    # response = jsonify(processedData)
    response_data = {'data': processedData}
    # response.headers.add('Content-Type', 'application/json')
    return jsonify(response_data)


def climateChange_data_processing(results):
    processedData = []
    for lis in results:
        dic = {}
        dic['year'] = int(lis[0])
        dic['quantity'] = lis[1]
        dic['climate'] = lis[2]
        processedData.append(dic)

    return processedData


@app.route('/api/climateChange/')
def climateChange_index():
    from_year = request.args.get('fromYear')
    to_year = request.args.get('toYear')
    country = request.args.get('country').lower()
    commodity = request.args.get('commodity').lower()
    climate = request.args.get('climate').lower()

    if (climate == 'humidity'):
        query = f'''
SELECT
    t.year AS year,
    ROUND(AVG(t.quantity), 2) AS avg_quantity,
    ROUND(AVG(cl.humidity), 2) AS avg_humidity,
    unitofmeasurement
FROM
    climate cl,
    locality l,
    country c,
    commodity co,
    trademetrics t
WHERE
    cl.localityid = l.localityid
    AND l.countryid = c.countryid
    AND co.commodityid = t.commodityid
    AND t.countryid = c.countryid
    AND t.year = TO_CHAR(cl.climatedate, 'yyyy')
    AND LOWER(c.countryname) = '{country}' -- in_country
    AND TO_CHAR(climatedate, 'yyyy') BETWEEN '{from_year}' AND '{to_year}' -- in_year
    AND LOWER(t.metrictype) LIKE LOWER('%production%') -- since it's production
    AND LOWER(co.commodityname) = '{commodity}' -- in_commodity
GROUP BY
    co.commodityname,
    c.countryname,
    t.year,
    unitofmeasurement
ORDER BY 1
            '''

    elif (climate == 'sea level'):
        query = f'''
SELECT
    t.year AS year,
    ROUND(AVG(t.quantity), 2) AS avg_quantity,
    ROUND(AVG(cl.sealevelrise), 2) AS avg_sealevelrise,
    unitofmeasurement
FROM
    climate cl,
    locality l,
    country c,
    commodity co,
    trademetrics t
WHERE
    cl.localityid = l.localityid
    AND l.countryid = c.countryid
    AND co.commodityid = t.commodityid
    AND t.countryid = c.countryid
    AND t.year = TO_CHAR(cl.climatedate, 'yyyy')
    AND LOWER(c.countryname) = '{country}' -- in_country
    AND TO_CHAR(climatedate, 'yyyy') BETWEEN '{from_year}' AND '{to_year}' -- in_year
    AND LOWER(t.metrictype) LIKE LOWER('%production%') -- since it's production
    AND LOWER(co.commodityname) = '{commodity}' -- in_commodity
GROUP BY
    co.commodityname,
    c.countryname,
    t.year,
    unitofmeasurement
ORDER BY 1
            '''

    elif (climate == 'temperature'):
        query = f'''
SELECT
    t.year AS year,
    ROUND(AVG(t.quantity), 2) AS avg_quantity,
    ROUND(AVG(cl.temperature), 2) AS avg_temperature,
    unitofmeasurement
FROM
    climate cl,
    locality l,
    country c,
    commodity co,
    trademetrics t
WHERE
    cl.localityid = l.localityid
    AND l.countryid = c.countryid
    AND co.commodityid = t.commodityid
    AND t.countryid = c.countryid
    AND t.year = TO_CHAR(cl.climatedate, 'yyyy')
    AND LOWER(c.countryname) = '{country}' -- in_country
    AND TO_CHAR(climatedate, 'yyyy') BETWEEN '{from_year}' AND '{to_year}' -- in_year
    AND LOWER(t.metrictype) LIKE LOWER('%production%') -- since it's production
    AND LOWER(co.commodityname) = '{commodity}' -- in_commodity
GROUP BY
    co.commodityname,
    c.countryname,
    t.year,
    unitofmeasurement
ORDER BY 1
            '''

    elif (climate == 'precipitation'):
        query = f'''
SELECT
    t.year AS year,
    ROUND(AVG(t.quantity), 2) AS avg_quantity,
    ROUND(AVG(cl.precipitation), 2) AS avg_precipitation,
    unitofmeasurement
FROM
    climate cl,
    locality l,
    country c,
    commodity co,
    trademetrics t
WHERE
    cl.localityid = l.localityid
    AND l.countryid = c.countryid
    AND co.commodityid = t.commodityid
    AND t.countryid = c.countryid
    AND t.year = TO_CHAR(cl.climatedate, 'yyyy')
    AND LOWER(c.countryname) = '{country}' -- in_country
    AND TO_CHAR(climatedate, 'yyyy') BETWEEN '{from_year}' AND '{to_year}' -- in_year
    AND LOWER(t.metrictype) LIKE LOWER('%production%') -- since it's production
    AND LOWER(co.commodityname) = '{commodity}' -- in_commodity
GROUP BY
    co.commodityname,
    c.countryname,
    t.year,
    unitofmeasurement
ORDER BY 1
            '''

    elif (climate == 'co2 emission'):
        query = f'''
SELECT
    t.year AS year,
    ROUND(AVG(t.quantity), 2) AS avg_quantity,
    ROUND(AVG(cl.C02emissions), 2) AS avg_C02emissions,
    unitofmeasurement
FROM
    climate cl,
    locality l,
    country c,
    commodity co,
    trademetrics t
WHERE
    cl.localityid = l.localityid
    AND l.countryid = c.countryid
    AND co.commodityid = t.commodityid
    AND t.countryid = c.countryid
    AND t.year = TO_CHAR(cl.climatedate, 'yyyy')
    AND LOWER(c.countryname) = '{country}' -- in_country
    AND TO_CHAR(climatedate, 'yyyy') BETWEEN '{from_year}' AND '{to_year}' -- in_year
    AND LOWER(t.metrictype) LIKE LOWER('%production%') -- since it's production
    AND LOWER(co.commodityname) = '{commodity}' -- in_commodity
GROUP BY
    co.commodityname,
    c.countryname,
    t.year,
    unitofmeasurement
ORDER BY 1
            '''

    elif (climate == 'wind speed'):
        query = f'''
 SELECT
     t.year AS year,
     ROUND(AVG(t.quantity), 2) AS avg_quantity,
     ROUND(AVG(cl.windspeed), 2) AS avg_windspeed,
     unitofmeasurement
 FROM
     climate cl,
     locality l,
     country c,
     commodity co,
     trademetrics t
 WHERE
     cl.localityid = l.localityid
     AND l.countryid = c.countryid
     AND co.commodityid = t.commodityid
     AND t.countryid = c.countryid
     AND t.year = TO_CHAR(cl.climatedate, 'yyyy')
     AND LOWER(c.countryname) = '{country}' -- in_country
     AND TO_CHAR(climatedate, 'yyyy') BETWEEN '{from_year}' AND '{to_year}' -- in_year
     AND LOWER(t.metrictype) LIKE LOWER('%production%') -- since it's production
     AND LOWER(co.commodityname) = '{commodity}' -- in_commodity
 GROUP BY
     co.commodityname,
     c.countryname,
     t.year,
     unitofmeasurement
ORDER BY 1
             '''

    # Execute the query
    results = execute_query(query)
    processedData = climateChange_data_processing(results)
    # response = jsonify(processedData)
    response_data = {'data': processedData}
    # response.headers.add('Content-Type', 'application/json')
    return jsonify(response_data)


def globalEvent_data_processing(results, flag):
    processedData = []
    for lis in results:
        dic = {}
        if flag:
            dic['year'] = str(lis[0]+4) + '_' + str(lis[1])
        else:
            dic['year'] = str(lis[0]) + '_' + str(lis[1])
        dic['price'] = lis[2]
        processedData.append(dic)

    return processedData


@app.route('/api/globalEvent/')
def globalEvent_index():
    globalEvent = request.args.get('fromEvent')
    if (globalEvent == 'Covid 19'):
        from_year = 2014
        to_year = 2019
        flag = True
    else:
        from_year = 2006
        to_year = 2011
        flag = False

    country = request.args.get('country').lower()
    commodity = request.args.get('commodity').lower()

    query = f'''
    SELECT year, month, value
    FROM (SELECT DISTINCT
            Country.countryName,
            Commodity.commodityName ,
            Price.year as year,
            cast(Price.month as int) as month,
            round(avg(Price.pricevalue),2) as value,
            price.commodityid
        FROM Price
        JOIN Locality ON Price.localityID = to_char(Locality.localityID)
        JOIN Country ON Locality.countryID = Country.countryID
        JOIN Commodity ON Price.commodityID = Commodity.commodityID
        WHERE LOWER(Country.countryName) = '{country}'
            AND LOWER(Commodity.commodityName) = '{commodity}'
            AND Price.year BETWEEN {from_year} AND {to_year}
            group by Country.countryName,
            Commodity.commodityName ,
            Price.year,
            Price.month,price.commodityid)
    ORDER BY year, month
    '''

    # Execute the query
    results = execute_query(query)
    processedData = globalEvent_data_processing(results, flag)
    response_data = {'data': processedData}
    # response.headers.add('Content-Type', 'application/json')
    return jsonify(response_data)


def unaffordability_data_processing(results):
    processedData = []
    for lis in results:
        dic = {}
        dic['year'] = lis[0]
        dic['unaffordability'] = lis[1]
        dic['price'] = lis[2]
        processedData.append(dic)

    return processedData


@app.route('/api/unaffordability/')
def unaffordability_index():

    from_year = request.args.get('fromYear')
    to_year = request.args.get('toYear')
    country = request.args.get('country').lower()

    query = f'''
 SELECT
    e.expenditureyear,
    e.affordabilityquotient AS affordabilityquotient,
    p.avg_price_per_year
FROM
    (
        SELECT
            countryid,
            year,
            ROUND(SUM(avg_price) / COUNT(commodityid), 2) AS avg_price_per_year
        FROM
            (
                SELECT
                    l.countryid,
                    p.year,
                    p.commodityid,
                    ROUND(AVG(p.pricevalue), 2) AS avg_price
                FROM
                    price p,
                    locality l
                WHERE
                    p.localityid = TO_CHAR(l.localityid)
                GROUP BY
                    l.countryid,
                    year,
                    p.commodityid
            )
        WHERE
            countryid = (SELECT countryid FROM country WHERE LOWER(countryname) = '{country}') -- input
            AND year BETWEEN '{from_year}' AND '{to_year}' -- input
        GROUP BY
            countryid,
            year
    ) p,
    (
        SELECT
            countryid,
            expenditureyear,
            affordabilityquotient
            --expenditureperperson
        FROM
            expenditure
        WHERE
            countryid = (SELECT countryid FROM country WHERE LOWER(countryname) = '{country}') -- input
            AND expenditureyear BETWEEN '{from_year}' AND '{to_year}' -- input
    ) e
WHERE
    e.expenditureyear = p.year
    AND e.countryid = p.countryid
ORDER BY 1
    '''

    # Execute the query
    results = execute_query(query)
    processedData = unaffordability_data_processing(results)
    # response = jsonify(processedData)
    response_data = {'data': processedData}
    # response.headers.add('Content-Type', 'application/json')
    return jsonify(response_data)


@app.route('/api/season/')
def season_index():

    from_year = request.args.get('fromYear')
    to_year = request.args.get('toYear')
    country = request.args.get('country').lower()
    commodity = request.args.get('commodity').lower()

    query = f'''
    select cast(month as integer) month,avg_price from (
    SELECT
        co.commodityname,
        p.month as month,
        l.countryid,
        ROUND(AVG(p.pricevalue), 2) AS avg_price
    FROM
        commodity co,
        price p,
        locality l,
        country c
    WHERE
        p.commodityid = co.commodityid
        AND LOWER(co.commodityname) = '{commodity}' -- Input
        AND p.localityid = TO_CHAR(l.localityid)
        AND l.countryid = c.countryid
        AND p.year BETWEEN '{from_year}' AND '{to_year}' -- Input
        AND LOWER(c.countryname) = '{country}' -- Input
    GROUP BY
        co.commodityname,
        p.month,
        l.countryid)
ORDER BY 1
    '''

    # Execute the query
    results = execute_query(query)
    processedData = season_data_processing(results)
    # response = jsonify(processedData)
    response_data = {'data': processedData}
    # response.headers.add('Content-Type', 'application/json')
    return jsonify(response_data)


def season_data_processing(results):
    processedData = []
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    for lis in results:
        dic = {}
        dic['monthName'] = months[int(lis[0])-1]
        dic['price'] = lis[1]
        processedData.append(dic)

    return processedData


@app.route('/home/')
def home():
    return 'Server Running'


if __name__ == '__main__':
    app.run(debug=True)

# oracle_username = 'tarunred.nimmala'
# oracle_password = '8SsWDreZu5aV0RD7cQp7TLie'
# oracle_host = 'oracle.cise.ufl.edu'
# oracle_port = '1521'
# oracle_service_name = 'orcl'
