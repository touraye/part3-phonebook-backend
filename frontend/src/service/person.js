import axios from "axios";

const baseUrl = '/api/persons'


const getAll = async () => {
    const request = axios.get( baseUrl );
    const response = await request;
    return response.data;
}

const addPerson = async ( object ) => {
    const request = axios.post(baseUrl, object)
    const response = await request;
    return response.data;
}

const deletePerson = ( id ) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const updatePerson = ( id, newNumber ) => {
    const request = axios.put(`${baseUrl}/${id}`, newNumber)
    return request.then(response => response.data)
}

const services = {
    getAll,
    addPerson,
    deletePerson,
    updatePerson
}

export default services