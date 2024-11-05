export const ENV = "dev" // change this to "prod" when deploying to production
export const BASE_URL = ENV === "dev" ? "http://localhost:5000" : ""
