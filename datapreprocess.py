import pandas as pd

#drop the categorical variables
df = pd.read_csv("data/listings.csv", low_memory=False)

# Drop the columns you don't want to keep
df = df.drop(["id",
              "listing_url",
              "scrape_id",
              "last_scraped",
              "source", 
              "description",
              "neighborhood_overview",
              "picture_url",
              "host_id",
              "host_url",
              "host_name",
              "host_since",
              "host_location",
              "host_about",
              "host_response_time",
              "host_response_rate",
              "host_acceptance_rate",
              "host_is_superhost",
              "host_thumbnail_url",
              "host_picture_url",
              "host_neighbourhood",
              "host_listings_count",
              "host_total_listings_count",
              "host_verifications",
              "host_has_profile_pic",
              "host_identity_verified",
              "neighbourhood",
              "neighbourhood_cleansed",
              "property_type",
              "room_type",
              "bathrooms",
              "beds",
              "amenities",
              "minimum_nights",
              "maximum_nights",
              "minimum_minimum_nights",
              "maximum_minimum_nights",
              "minimum_maximum_nights",
              "maximum_maximum_nights",
              "minimum_nights_avg_ntm",
              "maximum_nights_avg_ntm",
              "calendar_updated",
              "has_availability",
              "calendar_last_scraped",
              "number_of_reviews",
              "number_of_reviews_ltm",
              "number_of_reviews_l30d",
              "first_review",
              "last_review",
              "license",
              "instant_bookable",
              "calculated_host_listings_count",
              "calculated_host_listings_count_entire_homes",
              "calculated_host_listings_count_private_rooms",
              "calculated_host_listings_count_shared_rooms"], axis=1)

# drop NaN value
df = df.dropna()

# Define a function to convert the first digit of the column to a float
def convert_to_float(value):
    if value == None:
        return 0
    elif str(value).split()[0] == 'Half-bath':
        return 0.5
    elif str(value).split()[0] == 'Shared' or str(value).split()[0] == 'Private':
        return 0
    else:
        return float(str(value).split()[0])

    
# Apply the function to the column and store the result in a new column
df['bathrooms_text'] = df['bathrooms_text'].apply(convert_to_float)
    
# Define a function to convert the first digit of the column to a float
def convert_to_float(value):
    return float(value.replace(',', '').strip('$'))

# Apply the function to the column and store the result in a new column
df['price'] = df['price'].apply(convert_to_float)

df = df.query('review_scores_accuracy > 4.5')
df = df.query('review_scores_checkin > 4.5')
df = df.query('review_scores_cleanliness > 4.5')
df = df.query('review_scores_communication > 4.5')
df = df.query('review_scores_location > 4.5')
df = df.query('review_scores_rating > 4.5')
df = df.query('review_scores_value > 4.5')
df = df.query('price < 450')
df = df.query('reviews_per_month <= 6.1')

# Randomly sample 1000 rows from the dataframe
df_sampled = df.sample(n=500, random_state=42)

# Save the resulting dataframe as a new CSV file
df_sampled.to_csv("data/newlistings.csv", index=False)

