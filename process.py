from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta
# from sklearn.manifold import MDS

import numpy as np
import pandas as pd
import json

#drop the categorical variables
df = pd.read_csv("data/newlistings.csv")

# DROP 10 Attributes
new_df = df.copy()

def getData():
    dict_df = new_df.to_dict()
    result =  [new_df.columns.values.tolist()] + new_df.values.tolist()
    return result,dict_df;

# -------------------Part 1-------------------
def getBarPlotData():
    manhattan_sat = new_df[new_df["neighbourhood_group_cleansed"] == "Manhattan"]
    queens_sat = new_df[new_df["neighbourhood_group_cleansed"] == "Queens"]
    bronx_sat = new_df[new_df["neighbourhood_group_cleansed"] == "Bronx"]
    brooklyn_sat = new_df[new_df["neighbourhood_group_cleansed"] == "Brooklyn"]
    staten_island_sat = new_df[new_df["neighbourhood_group_cleansed"] == "Staten Island"]

    barplot_data = []
    barplot_data.append({"borough":"MH", "BoroughId": 1,
                    "Average Price":round(manhattan_sat['price'].mean())})
    barplot_data.append({"borough":"SI", "BoroughId": 5,
                    "Average Price":round(staten_island_sat['price'].mean())})
    barplot_data.append({"borough":"BX", "BoroughId": 3,
                    "Average Price":round(bronx_sat['price'].mean())})
    barplot_data.append({"borough":"QN", "BoroughId": 4,
                    "Average Price":round(queens_sat['price'].mean())})
    barplot_data.append({"borough":"BK", "BoroughId": 2,
                    "Average Price":round(brooklyn_sat['price'].mean())})
    
    barplot_df = pd.DataFrame(barplot_data, columns = ["borough","Average Price"])
    return barplot_data;


def getBoroughData():
    f = open('data/nyc.json')
    data = json.load(f)
    f.close()
    return data


def getBoroughId(borough):
    if borough == "Manhattan":
        return 1
    if borough == "Brooklyn":
        return 2
    if borough == "Bronx":
        return 3
    if borough == "Queens":
        return 4
    if borough == "Staten Island":
        return 5


def getLocationData():
    location_data = []
    for index, row in new_df.iterrows():
        location_data.append({"longitude": row["longitude"], "latitude": row["latitude"], "BoroughId": getBoroughId(row["neighbourhood_group_cleansed"]), "SampleId": index, "HotelName": row["name"], "Price": row["price"]})
    return location_data


def getColumnNames():
    columns_df = new_df.drop(columns=['latitude', 'longitude', 'name', 'availability_60', 'availability_90', 'review_scores_accuracy', 'review_scores_checkin', 'review_scores_communication','review_scores_value'])
    columns_df.rename(columns={'neighbourhood_group_cleansed': 'District'}, inplace=True)
    columns_df.rename(columns={'accommodates': 'Accoms'}, inplace=True)
    columns_df.rename(columns={'bathrooms_text': 'Bath'}, inplace=True)
    columns_df.rename(columns={'bedrooms': 'Bed'}, inplace=True)
    columns_df.rename(columns={'price': 'Price'}, inplace=True)
    columns_df.rename(columns={'availability_365': 'Availab Y'}, inplace=True)
    columns_df.rename(columns={'availability_30': 'Availab M'}, inplace=True)
    columns_df.rename(columns={'review_scores_rating': 'Rating'}, inplace=True)
    columns_df.rename(columns={'review_scores_cleanliness': 'Cleanliness'}, inplace=True)
    columns_df.rename(columns={'review_scores_location': 'Location'}, inplace=True)
    columns_df.rename(columns={'reviews_per_month': 'Rev. Freq.'}, inplace=True)
    return columns_df.columns.values.tolist()


def getParallelCoordsData():
    parall_coords_df = new_df.drop(columns=['latitude', 'longitude', 'name', 'availability_60', 'availability_90', 'review_scores_accuracy', 'review_scores_checkin', 'review_scores_communication','review_scores_value'])
    parall_coords_df.rename(columns={'neighbourhood_group_cleansed': 'District'}, inplace=True)
    parall_coords_df.rename(columns={'accommodates': 'Accoms'}, inplace=True)
    parall_coords_df.rename(columns={'bathrooms_text': 'Bath'}, inplace=True)
    parall_coords_df.rename(columns={'bedrooms': 'Bed'}, inplace=True)
    parall_coords_df.rename(columns={'price': 'Price'}, inplace=True)
    parall_coords_df.rename(columns={'availability_365': 'Availab Y'}, inplace=True)
    parall_coords_df.rename(columns={'availability_30': 'Availab M'}, inplace=True)
    parall_coords_df.rename(columns={'review_scores_rating': 'Rating'}, inplace=True)
    parall_coords_df.rename(columns={'review_scores_cleanliness': 'Cleanliness'}, inplace=True)
    parall_coords_df.rename(columns={'review_scores_location': 'Location'}, inplace=True)
    parall_coords_df.rename(columns={'reviews_per_month': 'Rev. Freq.'}, inplace=True)
    cols = parall_coords_df.columns.values

    parallel_coords = []
    for index, row in parall_coords_df.iterrows():
        parallel_coord = {}
        for col in cols:
            parallel_coord[col] = row[col]
        parallel_coord["color"] = getBoroughId(row["District"])
        parallel_coord["SampleId"] = index
        parallel_coords.append(parallel_coord)
    return parallel_coords


def getScatterplotMatrixData():
    scatterplotmatrix_data = []
    for index, row in new_df.iterrows():
        scatterplotmatrix_row = {"Rating": row["review_scores_rating"],
                                 "Accu": row["review_scores_accuracy"],
                                 "Clean": row["review_scores_cleanliness"],
                                 "Check": row["review_scores_checkin"],
                                 "Commun": row["review_scores_communication"],
                                 "Loc": row["review_scores_location"],
                                 "Avai M": row["availability_30"],
                                 "Avai BM": row["availability_60"],
                                 "Avai S": row["availability_90"],
                                 "Avai Y": row["availability_365"],
                                 "BoroughId": getBoroughId(row["neighbourhood_group_cleansed"]),
                                 "Price": row["price"],
                                 "Review": row["reviews_per_month"],
                                 "SampleId": index}
        
        scatterplotmatrix_data.append(scatterplotmatrix_row)
    return scatterplotmatrix_data


def getHistogramData():
    histo_data = {}
    percent_tested = []
    for index, row in new_df.iterrows():
        percent_tested.append(row["price"])
    histo_data["data"] = percent_tested
    # print(percent_tested)
    return histo_data

def getBiplotData():
    # pca_f = None
    pca_f = pd.read_csv("data/pca_featdata.csv").to_dict(orient='records')
    # pca_a = None
    pca_a = pd.read_csv("data/pca_axes.csv").to_dict(orient='records')
    return pca_f, pca_a

def getScreePlotData():
    screen_plot_data = pd.read_csv("data/scree_data.csv").to_dict(orient='records')
    return screen_plot_data