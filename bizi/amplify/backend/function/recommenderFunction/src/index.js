

exports.handler = async (event) => {
    var userPreferences = event.arguments.preferences;
    var businessAttributes = event.arguments.attributes;
    businessAttributes = businessAttributes.map((item) => JSON.parse(item));

    // business attributes argument
    // [[businessID, attributes]] => first string is the id, the rest are attributes
    // reformat this to [[id, [attributes]]]
    businessAttributes = businessAttributes.map((business) => {
        var id = business[0];
        var attributes = business.slice(1);
        return [id, attributes];
    });
    console.log(businessAttributes);
    // user preference vector
    // [sustainable, supply chain, diversity, shopping, food, services]
    var possiblePrefs = [
        'Sustainability',
        'Ethical Supply Chain',
        'Diversity Initiatives',
        'Community Engagement',
        'Shopping',
        'Food',
        'Services'
    ];
    var userPrefVector = possiblePrefs
        .map((pref) => Number(userPreferences.includes(pref)));
    console.log(userPrefVector);
    var businessAttributesDict = {};    
    for (var index in businessAttributes) {
        console.log(index);
        console.log(businessAttributes[index][1]);
        var businessVector = possiblePrefs
            .map((pref) => Number(businessAttributes[index][1].includes(pref)));
        console.log(businessVector);
        businessAttributesDict[businessAttributes[index][0]] = {
            vector: businessVector,
            distance: 0
        };
    }

    for (var businessId in businessAttributesDict) {
        var distance = 0;
        for (var i = 0; i < 6; i++) {
            distance += Math.abs(userPrefVector[i] - businessAttributesDict[businessId]['vector'][i]);
        }

        businessAttributesDict[businessId] = {
            vector: businessAttributesDict[businessId]['vector'],
            distance: distance
        };
    }
    console.log(businessAttributesDict);
    var businessDist = Object.keys(businessAttributesDict)
        .map((business) => [business, businessAttributesDict[business]['distance']]);
    businessDist = businessDist.sort(function(a, b) {
        return a[1] - b[1];
    });
    console.log(businessDist);
    var finalIDs = businessDist.map((item) => item[0]);
    console.log(finalIDs);
    return finalIDs.slice(0, 4);
};
