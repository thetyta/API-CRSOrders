import addressRoute from "./addressRoute.js";
import categoryRoute from "./categoryRoute.js";
import cupomRoute from "./cupomRoute.js";
import orderProductRoute from "./orderProductRoute.js";
import orderRoute from "./orderRoute.js";
import paymentRoute from "./paymentRoute.js";
import productRoute from "./productRoute.js";
import userRoute from "./userRoute.js";

function Routes(app){
    userRoute(app)
    addressRoute(app)
    categoryRoute(app)
    cupomRoute(app)
    orderProductRoute(app)
    orderRoute(app)
    paymentRoute(app)
    productRoute(app)
}

export default Routes;