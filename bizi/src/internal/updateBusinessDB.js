// Tool used to push custom business data to amplify
// Only uncomment when doing this in Footer.js
import React from 'react'
import { API } from 'aws-amplify'
import * as mutations from '../graphql/mutations.js'
import * as queries from '../graphql/queries.js'
import data from '../internal/businessInfo.json';

async function updateExisting(data) {
    // read in all existing businesses from db
    try {
        var businessQuery = await API.graphql({
            query: queries.listBusinesss,
            variables: {limit: 1000}
        });
        var listBusinesses = businessQuery?.data?.listBusinesss?.items;
    }
    catch (e) {
        console.log(e);
    }

    // update each business
    for (var business in listBusinesses) {
        const initBuckets = {
            "Sustainability": [
                'Recycling', 
                'Waste Reduction',
                'Renewable Energy Sources',
                'LEED Certified',
                'Sustainable Products',
                'Vegan Friendly',
                'Vegetarian Friendly',
                'Vegan Products',
                'Vintage'
            ],
            "Ethical Supply Chain": [
                'Handmade',
                'Animal Cruelty Free',
                'Locally Sourced'
            ],
            "Diversity Initiatives": [
                'Diversity Initiatives',
                'Family Owned',
                'Female Owned',
                'Minority Owned',
                'Black Owned',
                'Wheelchair Friendly'
            ]
        };
        var initiatives = data[listBusinesses[business]?.businessName]?.["Initiatives"];
        for (var bucket in initBuckets) {
            if (initBuckets[bucket]?.some(init => 
                initiatives?.includes(init))) {
                    if (!initiatives?.includes(bucket)) {
                        initiatives = initiatives?.concat(bucket);
                    }
            }
        }

        var searchTags = data[listBusinesses[business]?.businessName]?.['Search Tags'] ?
            data[listBusinesses[business]?.businessName]?.['Search Tags']
                .concat(data[listBusinesses[business]?.businessName]?.['Initiatives'])
                .concat(listBusinesses[business]?.businessName)
                .concat(data[listBusinesses[business]?.businessName]?.['Subheading']) :
            data[listBusinesses[business]?.businessName]?.['Initiatives']
                .concat(listBusinesses[business]?.businessName)
                .concat(data[listBusinesses[business]?.businessName]?.['Subheading']);
        
        const business_obj = {
            ...listBusinesses[business],
            initiatives: initiatives,
            searchTags: searchTags,
        };

        // update
        console.log(listBusinesses[business]);
        console.log(business_obj);
        try {
            await API.graphql({
                query: mutations.updateBusiness,
                variables: {input: business_obj}
            });
        }
        catch(e) {
            console.log(e);
        }
    }
}

async function updateDB(data) {
    for (var business in data) {
        const initBuckets = {
            "Sustainability": [
                'Recycling', 
                'Waste Reduction',
                'Renewable Energy Sources',
                'LEED Certified',
                'Sustainable Products',
                'Vegan Friendly',
                'Vegetarian Friendly',
                'Vegan Products',
                'Vintage'
            ],
            "Ethical Supply Chain": [
                'Handmade',
                'Animal Cruelty Free',
                'Locally Sourced'
            ],
            "Diversity Initiatives": [
                'Diversity Initiatives',
                'Family Owned',
                'Female Owned',
                'Minority Owned',
                'Black Owned',
                'Wheelchair Friendly'
            ]
        };
        var initiatives = data[business]?.["Initiatives"];
        for (var bucket in initBuckets) {
            if (initBuckets[bucket]?.some(init => 
                initiatives?.includes(init))) {
                    if (!initiatives?.includes(bucket)) {
                        initiatives = initiatives?.concat(bucket);
                    }
            }
        }

        var searchTags = data[business]?.['Search Tags'] ?
            data[business]?.['Search Tags']
                .concat(data[business]?.['Initiatives'])
                .concat(business)
                .concat(data[business]?.['Subheading']) :
            data[business]?.['Initiatives']
                .concat(business)
                .concat(data[business]?.['Subheading']);
        
        const business_obj = {
            businessName: business,
            businessDescription: data[business]?.['Description'],
            businessSubHeading: data[business]?.['Subheading'],
            initiatives: initiatives,
            policyList: data[business]?.['Policies'],
            businessPhone: data[business]?.['Phone Number'],
            businessEmail: data[business]?.['Email'],
            businessURL: data[business]?.['Website'],
            deliveryURL: data[business]?.['Order Online'],
            reservationURL: data[business]?.['Reservations'],
            address: data[business]?.['Address'],
            searchTags: searchTags,
            priceRange: data[business]?.['Price Range'],
            schedule: data[business]?.['Schedule'],
            imgPath: data[business]?.['Business Photo'],
            discounts: data[business]?.["Discounts"],
            approved: data[business]?.['Approved']
        };

        try {
            const newBusiness = await API.graphql({
                query: mutations.createBusiness,
                variables: {input: business_obj}
            });
            console.log(newBusiness);
        }
        catch(error) {
            console.log(error);
        }
        console.log(business_obj);
    }
}

export function InternalDBTool(props) {
    return (
        <button onClick={() => updateExisting(data)}>
            Sync DB
        </button>
    );
}