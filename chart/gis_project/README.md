# Does the Cost of Cigarettes Prevent People from Smoking?

This project was created for DATA 78000 Geospatial Humanities and Spatial Data Analysis and Visualization class with Dr. Shipeng Sun at the CUNY Graduate Center, Spring 2021.

Being born and raised in Russia, I know that the price of cigarettes over there is very low and has never stopped anyone from smoking. After moving to the US, I was shocked at how expensive cigarettes in this country were. I couldn’t stop wondering if the cost of the cigarettes would change the number of people who smoke. I decided to take a look at the correlation between the average cost of cigarettes and the cigarette consumption in the United States.

I use few sources of data for this project. Main one is Centers for Disease Control and Prevention and their data from data.gov: [The Tax Budren on Tobacco, 1970-2019](https://catalog.data.gov/dataset/the-tax-burden-on-tobacco-1970-2018-ea78d). Categorical data is taken from [Current Cigarette Smoking among Adults in the United States](https://www.cdc.gov/tobacco/data_statistics/fact_sheets/adult_data/cig_smoking/index.htm#:~:text=In%202019%2C%20nearly%2014%20of,with%20a%20smoking%2Drelated%20disease.). For preparing, analyzing and visualizing data for this project I used Excel, Python (Jupyter Notebooks), QGIS, ArcGIS and D3.js.

Data Preparation:
1.
The Tax Burden on Tobacco, 1970-2019 data consists of the data collected from 51 states from 1970 to 2019. The data provides GeoLocation of each state as a pair of coordinates. To use these data points in QGIS and other analyses, I had to get rid of the parenthesis and separate latitude from longitude. I did this in Jupyter Notebooks. The example of the code could be found [here](https://github.com/nchikurova/www/blob/main/chart/gis_project/State_tax_per_pack.ipynb). 

To visualize states as polygons I used [usState.json](https://github.com/nchikurova/www/blob/main/chart/data/usState.json).

2. 
The Tax Burden on Tobacco, 1970-2019 data includes:
-	*Average Cost per pack* (Average Cost Per Pack is the weighted average of the cost of a pack of cigarettes. These prices also do not include sales tax.)
-	Cigarette Consumption (Pack Sales Per Capita): Tax-paid sales represent the number of packs in a given state for which state excise taxes were paid (either through the purchase of stamps by a wholesale/distributor or through the filing of a monthly return by the wholesaler/distributor. For tax-paid sales per capita, the number of tax-paid sales for the state is divided by the population for the state as estimated by the U.S. Census Bureau for the relevant year. The population figures used for the states are Census Bureau estimates as of July 1 of the respective fiscal years.
-	Federal and State Tax as a Percentage of Retail Price (Federal and State Tax as a Percentage of Retail Price is the amount of federal and state tax as a percentage of the retail price for a pack of cigarettes.)
-	Federal and State Tax per Pack (Federal and State Tax Per Pack is the dollar amount of federal and state tax combined for each pack of cigarettes.)
-	Gross Cigarette Tax Revenue (Annual Gross Tax Revenue from Cigarettes is the yearly gross tax revenue generated from the sale of cigarettes measured in thousands of dollars. Data is based on fiscal years ending June 30.)
-	State Tax per pack (State Tax Per Pack is the amount of state tax applied to each pack of cigarettes.)
For further analyses I separated these categories into different datasets using Excel and function Filter.





