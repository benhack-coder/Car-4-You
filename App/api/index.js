import axios from "axios"
import config from "../config.json"

export async function getModelsByFavourite() {
    const options = {
        headers:
            {
                "Authorization": global.token,
            }
    }
    try {
        let response = await axios.get(config.carAPI + config.fetchFavourites, options)
        if (response.headers.authorization) {
            global.token = response.headers.authorization
        }
        return response.data;
    } catch (e) {
        console.error(e)
        return [];
    }
}

export async function deleteUserAccount() {
    const options = {
        headers:
            {
                "Authorization": global.token,
            }
    }
    try {
        let response = await axios.delete(config.userAPI + config.deleteUser, options)
        if (response.status === 200) {
            global.token = 'guest'
            return response.data;
        }
    } catch (e) {
        console.error(e)
        return "";
    }
}

export async function addFavourite(id) {
    const options = {
        headers:
            {
                "Authorization": global.token,
                'car': id,
                'action': "add"
            }
    }

    try {
        let response = await axios.get(config.carAPI + config.manageFavourite, options)
        if (response.headers.authorization) {
            global.token = response.headers.authorization
        }
        return response.data;
    } catch (e) {
        console.error(e)
        return "";
    }
}

export async function deleteFavourite(id) {
    const options = {
        headers:
            {
                "Authorization": global.token,
                'car': id,
                'action': "delete"
            }
    }

    try {
        let response = await axios.get(config.carAPI + config.manageFavourite, options)
        if (response.headers.authorization) {
            global.token = response.headers.authorization
        }
        return response.data;
    } catch (e) {
        console.error(e)
        return "";
    }
}

export async function getModelsByBrand(brand) {
    try {
        let response = await axios.get("https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/" + brand + "?format=json")
        return response.data;
    } catch (e) {
        console.error(e)
        return [];
    }
}

export async function getSearchData(text) {
    const options = {
        headers:
            {
                "Authorization": global.token,
                'filter': "model",
                "filtervalue": text
            }
    }
    try {
        let response = await axios.get(config.carAPI + config.filter, options)
        if (response.headers.authorization) {
            global.token = response.headers.authorization
        }
        return response.data;
    } catch (e) {
        console.error(e)
        return [];
    }
}

export async function getSearchUserData(text) {
    const options = {
        headers:
            {
                "Authorization": global.token
            }
    }
    try {
        let response = await axios.get(config.userAPI + config.filterowners + text, options)
        if (response.headers.authorization) {
            global.token = response.headers.authorization
        }
        return response.data;
    } catch (e) {
        console.error(e)
        return [];
    }
}

export async function getViewProfileCar(user) {
    const options = {
        headers:
            {
                "Authorization": global.token,
                "filter": "owner",
                "filtervalue": user
            }
    }
    try {
        let response = await axios.get(config.carAPI + config.filter, options)
        if (response.headers.authorization) {
            global.token = response.headers.authorization;
        }
        return response.data;
    } catch (e) {
        console.error(e)
        return [];
    }
}


export async function getCarData() {
    const options = {
        headers:
            {
                "Authorization": global.token
            }
    }
    try {
        let response = await axios.get(config.carAPI + config.userCar, options)
        if (response.headers.authorization) {
            global.token = response.headers.authorization
        }
        return response.data;
    } catch (e) {
        console.error(e)
        return [];
    }
}

export async function getProfileData() {
    const options = {
        headers:
            {
                "Authorization": global.token
            }
    }
    try {
        let response = await axios.get(config.userAPI + config.fetchUser, options)
        if (response.headers.authorization) {
            global.token = response.headers.authorization
        }
        return response.data;
    } catch (e) {
        console.error(e)
        return {};
    }
}

export async function getFilteredModels(price, km, location) {
    const options = {
        headers: {
            "Authorization": global.token,
            "max": price,
            "km": km,
            "location": location
        }
    }
    try {
        let response = await axios.get(config.carAPI + config.results, options)
        if (response.headers.authorization) {
            global.token = response.headers.authorization
        }
        return response.data;
    } catch (e) {
        console.error(e)
        return [];
    }
}

export async function getOwnerData(username) {
    const options = {
        headers:
            {
                "Authorization": global.token
            }
    }
    try {
        let response = await axios.get(config.userAPI + config.fetchUser + username, options)
        if (response.headers.authorization) {
            global.token = response.headers.authorization
        }
        return response.data;
    } catch (e) {
        console.error(e)
        return {};
    }
}

export async function sendEmail(text, user, car, startDate, endDate, price) {
    const options = {
        headers: {
            'Authorization': global.token,
            'emailText': text,
            'to': user.eMail,
            'car': car,
            'start_date': startDate,
            'end_date': endDate,
            'price': price
        }
    }

    try {
        let response = await axios.get(config.userAPI + config.sendEmail, options)
        if (response.headers.authorization) {
            global.token = response.headers.authorization
        }
        return 1;
    } catch (e) {
        console.error(e)
        return 0;
    }
}

export async function postRating(stars, text, carId) {
    const data = {
        "text": text,
        "numStars": stars
    }

    const headers = {
        'Authorization': global.token,
        'car': carId
    }

    try {
        let response = await axios.post(config.carAPI + config.addRating, data, {headers: headers})
        if (response.headers.authorization) {
            global.token = response.headers.authorization
        }
        return 1;
    } catch (e) {
        console.error(e)
        return 0;
    }
}


export async function postUserTelNum(username, email, telNum) {
    const headers = {
        headers: {'Authorization': global.token}
    }

    const user = {
        UserName: username,
        eMail: email,
        telNum: telNum
    }

    try {
        let response = await axios.post(config.userAPI + config.updateInfo, user, headers)
        if (response.headers.authorization) {
            global.token = response.headers.authorization
        }
        return 1;
    } catch (e) {
        console.error(e)
        return 0;
    }
}


export async function uploadCar(image, brand, model, location, year, fuel, km, dailyPrice) {
    let formdata = new FormData()
    formdata.append('image', {type: 'image/jpg', uri: image, name: 'test.jpg'})
    formdata.append('brand', brand)
    formdata.append('model', model)
    formdata.append('location', location)
    formdata.append('year', year)
    formdata.append('fuel', fuel)
    formdata.append('km', km)
    formdata.append('dailyPrice', dailyPrice)

    const options = {
        headers:
            {
                "Authorization": global.token,
                'Content-Type': 'multipart/form-data;'
            }
    }

    try {
        let response = await axios.post(config.carAPI + config.insertCar, formdata, options)
        if (response.headers.authorization) {
            global.token = response.headers.authorization
        }
        return 1;
    } catch (e) {
        console.error(e)
        return 0;
    }
}

export async function deleteCar(id) {
    const car = {
        id: id
    }
    try {
        let response = await axios.delete(config.carAPI + config.deleteCar, {
            headers: {'Authorization': global.token},
            data: car
        })
        if (response.headers.authorization) {
            global.token = response.headers.authorization
        }
        return 1;

    } catch (e) {
        console.error(e)
        return 0;
    }
}

export async function fetchRatings(id) {

    const options = {
        headers:
            {
                "Authorization": global.token,
                "id": id
            }
    }
    try {
        let response = await axios.get(config.carAPI + config.fetchRatings, options)
        if (response.headers.authorization) {
            global.token = response.headers.authorization
        }
        return response.data;

    } catch (e) {
        console.error(e)
        return [];
    }
}

export async function login(username, password) {

    const userData = {
        userName: username,
        password: password
    }

    try {
        let response = await axios.post(config.userAPI + config.login, userData)
        if (response.status === 200) {
            global.token = response.headers.authorization
            return 1;
        } else if (response.status === 401) {
            return 2;
        } else {
            return 0;
        }
    } catch (e) {
        console.error(e)
        return 0;
    }
}

export async function register(username, email, password) {

    const userData = {
        userName: username,
        eMail: email,
        password: password
    }
    try {
        let response = await axios.post(config.userAPI + config.register, userData)
        if (response.status === 200 && response.data === 1) {
            global.token = response.headers.authorization
            return 1;
        } else if (response.data === 0) {
            return 0;
        } else {
            return 2;
        }
    } catch (e) {
        console.error(e)
        return 0;
    }
}
