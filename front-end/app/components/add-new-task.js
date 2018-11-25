import Component from '@ember/component';
import {inject as service} from '@ember/service';
import $ from 'jquery';


export default Component.extend({
 sub1Time: -1, sub2Time: -1, sub3Time: -1,
 actions: {
    onClick(taskname,duedate, sub1, sub2, sub3){
        let username = "frontend";
        let subnames = sub1+','+sub2+','+sub3;
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", function(resp){
            console.log(resp);
        });
        oReq.open("GET", 'https://ahmedhs.lib.id/lbc/calTaskIns/?username='+username+'&taskname='+taskname+'&subnames='+subnames+'&sub1='+this.sub1Time+'&sub2='+this.sub2Time+'&sub3='+this.sub3Time+'&endDate='+duedate);
        oReq.send();
    },
    changeSub1Time(value){
        this.sub1Time = value;
    },
    changeSub2Time(value){
        this.sub2Time = value;
    },
    changeSub3Time(value){
        this.sub3Time = value;
    },
    openModal: function () {
        this.set('title', null);
        this.set('body', null);
        $('.ui.newTask.modal').modal({
        closable: false,
        detachable: false,

        onDeny: () => {
            return true;
        },

        onApprove: () => {
        var newPost = this.get('DS').createRecord('post', {
        title: this.get('title'),
        body: this.get('body')
        });
        newPost.save().then(()=> {
        return true;
        });
        }
        })
        .modal('show');
    },
 }
}); 
