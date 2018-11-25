import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('about');
  this.route('schedule_task');
  this.route('preferences');
  this.route('scheduletask');
});

export default Router;
