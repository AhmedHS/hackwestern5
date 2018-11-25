import Component from '@ember/component';
export default Component.extend({
    Sunday:false, Monday:false, Tuesday:false, Wednesday:false, Thursday:false, Friday:false, Saturday :false, activity: '', start: -1, end: -1, prefStart: -1, prefEnd: -1,
    actions:{
        onClick(Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, activities){
            var username = 'frontend';
            var daysExcluded = [];
            if(!Sunday) daysExcluded.push('Sunday');
            if(!Monday) daysExcluded.push('Monday');
            if(!Tuesday) daysExcluded.push('Tuesday');
            if(!Wednesday) daysExcluded.push('Wednesday');
            if(!Thursday) daysExcluded.push('Thursday');
            if(!Friday) daysExcluded.push('Friday');
            if(!Saturday) daysExcluded.push('Saturday');
            // lib.ahmedhs.lbc.prefIns(username, this.start, this.end, this.prefStart, this.prefEnd, daysExcluded, activities, function(err, result){});
            var oReq = new XMLHttpRequest();
            oReq.addEventListener("load", function(){
                console.log("Test");
            });
            oReq.open("GET", 'https://ahmedhs.lib.id/lbc/prefIns/?username='+username+'&start='+this.start+'&end='+this.end+'&prefStart='+this.prefStart+'&prefEnd='+this.prefEnd+'&daysExcluded='+daysExcluded+'&wellness='+activities);
            oReq.send();
        },
        updateEST(value){
            this.start = value;
        },
        updateLET(value){
            this.end = value;
        },
        updatePST(value){
            this.prefStart = value;
        },
        updatePET(value){
            this.prefEnd = value;
        },
        
    }
});
