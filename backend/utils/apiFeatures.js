class ApiFeatures {
  constructor(query, querStr) {
    this.query = query
    this.queryStr = querStr
  }

  search() {
    const keyword = this.queryStr.keyword ? {
      name: {
        $regex: this.queryStr.keyword,
        $options: "i"
      },
    } : {}

    this.query = this.query.find({ ...keyword })

    console.log(keyword);

    return this
  }

  filter() {
    const queryCopy = { ...this.queryStr }
    const removeFields = ["keyword", "page", "limit"]

    removeFields.forEach(key => delete queryCopy[key])

    //filer for price and rating
    let queryStr = JSON.stringify(queryCopy)

    queryStr = queryStr.replace(/(gt|gte|lt|lte)/g, key => `$${key}`)

    // console.log(queryStr);

    this.query = this.query.find(JSON.parse(queryStr))
    return this
  }

  pagination(resultPerPage) {

    const currentPage = this.queryStr.page ? Number(this.queryStr.page) : 1


    const skip = resultPerPage * (currentPage - 1)
    console.log(skip);

    this.query = this.query.limit(resultPerPage).skip(skip)
    return this
  }

}
module.exports = ApiFeatures