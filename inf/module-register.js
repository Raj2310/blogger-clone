module.exports = function(appObject,moduleObjects){
    moduleObjects.array.forEach(module => {
        module.routes.forEach(route =>{
            appObject.use(routePath,routeFunction)
        })
    });

}