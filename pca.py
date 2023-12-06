import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

raw_data = pd.read_csv('newlistings.csv')

features = ["accommodates", "bathrooms_text", "bedrooms", "availability_30",
            "availability_365", "review_scores_rating", "review_scores_cleanliness",
            "review_scores_communication", "review_scores_location",  "review_scores_value",
            "reviews_per_month"]
result = ["price"]

X = raw_data[features].to_numpy()
Y = raw_data[result].to_numpy()

X = StandardScaler().fit_transform(X)



pca = PCA()

pca.fit(X)

eigenvectors = pca.components_.T

eigenvalues = pca.explained_variance_

explained_ratio = pca.explained_variance_ratio_

pca_csv = pd.DataFrame(eigenvectors, index=features)

pca_csv.to_csv('pca.csv', index=features)





scree = pd.DataFrame(np.stack((eigenvalues, pca.explained_variance_ratio_), axis=-1), columns=['eigen_values','explained_ratio'])
scree['explained_ratio_cum'] = scree['explained_ratio'].cumsum()

scree.to_csv('scree_data.csv')




kmeans1 = KMeans(n_clusters=4, random_state=0).fit(X)

pca2 = PCA(n_components=2)
X_pca2ed = pca2.fit_transform(X)

scat_df = pd.DataFrame(X_pca2ed, columns=['x','y'])
scat_df['label'] = kmeans1.labels_
scat_df.to_csv('pca_featdata.csv', index=False)

axes_df = pd.DataFrame((pca2.components_).T, columns=['x','y'])
axes_df.to_csv('pca_axes.csv', index=False)

