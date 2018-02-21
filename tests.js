describe("Test checkNumber()", function() {
    var n = 0;
    it("Positive integer", function() {
        n = 20;
        expect(checkNumber(n)).toBe(n);
    });
    
    it("Positive float", function() {
        n = 35.5;
        expect(checkNumber(n)).toBe(n);
    });
    
    it("Negative integer", function() {
        n = -15;
        expect(checkNumber(n)).toBe(n);
    });
    
    it("Negative float", function() {
        n = -1.33;
        expect(checkNumber(n)).toBe(n);
    });
    
    it("Contains letter", function() {
        n = "a33";
        expect(checkNumber(n)).toBeNaN();
    });
    
    it("Contains more than one '-'", function() {
        n = "-2-2";
        expect(checkNumber(n)).toBeNaN();
    });
    
    it("Contains whitespace", function() {
        n = "4 3";
        expect(checkNumber(n)).toBeNaN();
    });
    
    it("Integer as string", function() {
        n = "22";
        expect(checkNumber(n)).toBe(parseInt(n));
    });
});

describe("Test storage functions", function() {
    var mockStorage, city1, city2, object1, object2;
    
    //Inits a mock localStorage for testing by adding spies to setItem and getItem
    //and by adding a few entries
    beforeEach(function() {
        city1 = "Tokio";
        city2 = "Stockholm";
        stringyArray1 = JSON.stringify([{temperature:22.5,time:1262304000000}]);
        stringyArray2 = JSON.stringify([{temperature:10,time:1262304000000+10000000},
                                       {temperature:-20,time:1262304000000+20000000},   //smallest
                                       {temperature:15,time:1262304000000+30000000},
                                       {temperature:-3.5,time:1262304000000+60000000},  //latest
                                       {temperature:55,time:1262304000000+50000000},    //largest
                                       {temperature:-10,time:1262304000000+40000000}]);
        mockStorage = [{city:city1,obj:stringyArray1},{city:city2,obj:stringyArray2}];
        
        spyOn(localStorage,'setItem').and.callFake(function(setCity, stringyArray) {
            for(var i = 0; i < mockStorage.length; i++){
                if(mockStorage[i].city == setCity){
                    mockStorage.splice(i,1);
                }
            }
            mockStorage.push({city:setCity, obj:stringyArray});
        });
        
        spyOn(localStorage,'getItem').and.callFake(function(getCity) {
            for(var i = 0; i < mockStorage.length; i++){
                if(mockStorage[i].city == getCity){
                    return mockStorage[i].obj
                }
            }
            return JSON.stringify([]);
        });
    });
    
    it("1 entry, getStorage()", function() {
        expect(getStorage("Tokio")).toEqual([{temperature:22.5,time:new Date(1262304000000).getTime()}]);
    });
    
    it("multiple entries, getStorage()", function() {
        expect(getStorage("Stockholm")[0]).toEqual({temperature:10,time:1262304000000+10000000});
        expect(getStorage("Stockholm")[1]).toEqual({temperature:-20,time:1262304000000+20000000});
        expect(getStorage("Stockholm")[5]).toEqual({temperature:-10,time:1262304000000+40000000});
    });
    
    it("0 entries, getStorage()", function() {
        expect(getStorage("Tampere")).toEqual([]);
    });
    
    it("storeEntry()", function() {
        storeEntry("Oulu", -22);
        expect(getStorage("Oulu")[0].temperature).toEqual(-22);
        expect(getStorage("Oulu")[0].time).toBeLessThanOrEqual(new Date().getTime());
    });
    
    it("getMax()", function() {
        expect(getMax("Stockholm").temperature).toEqual(55);
    });
    
    it("getMin()", function() {
        expect(getMin("Stockholm").temperature).toEqual(-20);
    });
    
    it("getLast()", function() {
        expect(getLast("Stockholm").temperature).toEqual(-3.5);
    });

});