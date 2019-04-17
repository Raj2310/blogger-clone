module.exports = function(appObject,moduleObjects){
    moduleObjects.forEach(module => {
        module.routes.forEach(route =>{
            appObject.use(route.routePath,route.routeFunction)
        })
    });
}