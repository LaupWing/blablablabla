function searchObj(query){
    return function(obj){
        for (var key in obj) {
            var value = obj[key];
            if (typeof value === 'object') {
                searchObj(value, query);
            }
            if (value.includes(query)) {
                return obj
            }
        }
    }
}

function removeAllNonAlpha(string){
    return string.replace(/[-'`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, '')
}
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

module.exports = {searchObj, removeAllNonAlpha, onlyUnique}