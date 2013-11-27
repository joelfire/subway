var UserView = Backbone.View.extend({
  initialize: function(user) {
    this.user = user;
  },

  className: 'userlist_user',

  render: function() {
    $(this.el).html(ich.userlist_user(this.user.model.attributes));
    return this;
  },

  addToIdle: function() {
    var idleTime = this.user.model.get('idle') + 1;
    if (idleTime > 60) {
      this.user.model.set({activity: '', user_status: 'idle'});
      clearInterval(this.intervalTimer);
    } else {
      this.user.model.set({
        activity: '(' + idleTime + 'm)',
        idle: idleTime,
        user_status: 'active'
      });
      if(this.intervalTimer === undefined) {
        this.setStatus();
      }
    }
    this.render();
  },

  setStatus: function() {
    // One-minute delays
    var self = this;
    var interval = 60 * 1000;
    this.intervalTimer = setInterval(function() { self.addToIdle() }, interval);
  }
});


var UserListView = Backbone.View.extend({
  initialize: function() {
    this.setElement(this.collection.channel.view.$('#user-list'));
    this.collection.bind('add', this.add, this);
  },

  render: function() {
    return this;
  },

	  add : function(User) {
		var userView = new UserView({
			model : User
		});
		User.view = userView;
		children = $(this.el).children();
		before = null;
		name1 = User.attributes['nick'].toUpperCase();
		for (i = 0; i < children.length; i++) {
		    userlist_user = children[i];
			userlist_user_info = userlist_user.children[1];
			name2 = userlist_user_info.innerText.toUpperCase();
			if (name1 < name2) {
				before = userlist_user; 
				break;
			}
		}
		if (before == null) {
			$(this.el).append(userView.render().el);
		} else {
			$(userView.render().el).insertBefore(before);
		}
	}
});
