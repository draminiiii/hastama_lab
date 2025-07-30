import pyodbc


conn = pyodbc.connect(r'DRIVER={ODBC Driver 17 for SQL Server};'
                          r'SERVER=localhost\SQLEXPRESS;'
                          r'DATABASE=userDB;'
                          r'Trusted_Connection=yes;')
cursor = conn.cursor()


cursor.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'")
tables = cursor.fetchall()

with open('exported_data.sql', 'w', encoding='utf-8') as f:
    for table in tables:
        table_name = table[0]
        
        cursor.execute(f"SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{table_name}'")
        columns = cursor.fetchall()

        
        f.write(f"CREATE TABLE IF NOT EXISTS `{table_name}` (\n")
        col_defs = []
        for col in columns:
            col_name, data_type, is_nullable = col
            mysql_type = {
                'int': 'INT',
                'bigint': 'BIGINT',
                'bit': 'BOOLEAN',
                'nvarchar': 'VARCHAR(255)',
                'varchar': 'VARCHAR(255)',
                'datetime': 'DATETIME',
                'date': 'DATE',
                'text': 'TEXT',
                'ntext': 'TEXT',
                'float': 'FLOAT',
                'decimal': 'DECIMAL(10,2)'
            }.get(data_type, 'TEXT')
            null_str = '' if is_nullable == 'NO' else ' NULL'
            col_defs.append(f"  `{col_name}` {mysql_type}{null_str}")
        f.write(",\n".join(col_defs))
        f.write("\n);\n\n")

      
        cursor.execute(f"SELECT * FROM {table_name}")
        rows = cursor.fetchall()
        if rows:
            columns_names = [desc[0] for desc in cursor.description]
            f.write(f"INSERT INTO `{table_name}` (`{'`, `'.join(columns_names)}`) VALUES\n")
            values_list = []
            for row in rows:
                values = []
                for val in row:
                    if val is None:
                        values.append("NULL")
                    elif isinstance(val, str):
                        values.append("'" + val.replace("'", "''") + "'")
                    elif isinstance(val, bool):
                        values.append("1" if val else "0")
                    else:
                        values.append(str(val))
                values_list.append("(" + ", ".join(values) + ")")
            f.write(",\n".join(values_list))
            f.write(";\n\n")

cursor.close()
conn.close()
