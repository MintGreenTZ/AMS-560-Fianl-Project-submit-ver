from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import numpy as np
import pandas as pd
from flask import Flask,render_template,make_response
from process import getData,getBarPlotData,getBoroughData, getLocationData, getColumnNames, getParallelCoordsData, getScatterplotMatrixData, getHistogramData, getBiplotData, getScreePlotData
# from process import getData,getBarPlotData,getPCAData, getParallelCoordsData, getColumnNames, getScatterplotMatrixData, getBoroughData, getLocationData, getHistogramData

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    r.headers["Access-Control-Allow-Origin"] = "*"
    return r

@app.route("/api")
def get_data():
    data_set,dict_df = getData()
    bar_plot_data = getBarPlotData()
    # exp_var,cum_exp_var,attribute,eigenvector,pca_data,biPlotSampleID= getPCAData()
    
    parallel_coords_data = getParallelCoordsData()
    scatterplotmatrix_data = getScatterplotMatrixData()
    borough_data = getBoroughData()
    location_data = getLocationData()
    histo_data = getHistogramData()
    column_names = getColumnNames()
    biplot_fdata, biplot_adata = getBiplotData()
    screeplot_data = getScreePlotData()
    data = {
        # "data_set":data_set,
        # "dict_df":dict_df,
        "bar_plot_data":bar_plot_data,
        # "exp_var":exp_var,
        # "cum_exp_var":cum_exp_var,
        # "attribute":attribute,
        # "eigenvector":eigenvector,
        # "pca_data":pca_data,
        # "biPlotSampleID":biPlotSampleID,
        "parallel_coords_data":parallel_coords_data,
        "scatterplotmatrix_data":scatterplotmatrix_data,
        "column_names":column_names,
        "borough_data": borough_data,
        "location_data": location_data,
        "biplot_fdata": biplot_fdata,
        "biplot_adata": biplot_adata,
        # "histo_data": histo_data,
        "screeplot_data": screeplot_data,
    }
    return data

if __name__ == "__main__":
    app.run(debug=True)