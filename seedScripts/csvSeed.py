import csv

csv_file = 'shortjokes.csv'
sql_file = 'seed.sql'

# Open the CSV file
with open(csv_file, 'r') as file:
    # Create a CSV reader object
    reader = csv.reader(file)
    
    # Skip the header row
    next(reader)
    
    # Open the SQL file for writing
    with open(sql_file, 'w') as sql:
        # Iterate over each row in the CSV file
        for row in reader:
            # Extract the values from the row
            id, joke = row
            
            joke = joke.replace("'", "''")

            # Generate the SQL insert statement
            sql_statement = f"INSERT INTO dev_jokes (id, joke, approved, used, discarded) VALUES ({id}, '{joke}', false, false, false);\n"
            
            # Write the SQL statement to the file
            sql.write(sql_statement)