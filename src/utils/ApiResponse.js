class ApiResponse{
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

//Represent successfully api operation
// This sends data unlinke the error class
// success only when statusCode < 400
// Data example like user profile, search results, profile, etc