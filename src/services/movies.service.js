let apiUrl = 'http://localhost:8001'
const axios = require('axios')
const fetchParams = {
    headers: {
        "x-access-token": localStorage['token']
    }
}
export class MoviesService {
    static initiateToken(){
        axios.get(apiUrl+'/api/movies/initiateToken',fetchParams)
    }
    static async getAllMovies() {
        const response = await axios.get(apiUrl + '/api/movies/getAllMoviesData')
        return response.data
    }
    static deleteAMovie(movieId){
        axios.delete(apiUrl+'/api/movies/deleteMovie',{
            data:{movieId:movieId}
        })
    }
    static async addMovie(movieObj){
        let response = await axios.post(apiUrl+'/api/movies/addMovie',{
            data:{movieObj:movieObj}
        })
        return response
    }

    static async getSpecificMovie(movieName){
        let allMovies=await this.getAllMovies()
        let specificMovie=allMovies.find(movie=>movie.Name===movieName)
        return specificMovie
    }
    static async editMovie(movieObj,prevMovieName){
        let response = await axios.put(apiUrl+'/api/movies/editMovie',{
            data:{movieObj:movieObj,prevMovieName:prevMovieName}
        })
        return response
    }
    static deleteSingleInnerSub(memberName,movieId){
        axios.delete(apiUrl+'/api/movies/deleteSingleInnerSub',{
            data:{memberName,movieId}
        })
    }
}