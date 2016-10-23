import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './todosList.html';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../../api/tasks.js';

class TodosListCtrl {
	constructor($scope) {
		$scope.viewModel(this);

		this.hideCompleted = false;

		this.helpers({
			tasks() {
				const selector = {};

				// If hide compmleted is checked, filter tasks
				if (this.getReactively('hideCompleted')) {
					selector.checked = {
						$ne: true
					};
				}

				// Show newest tasks at the top
				return Tasks.find(selector, {
					sort: {
						createdAt: -1
					}
				});
			},
			incompleteCount() {
				return Tasks.find({
					checked: {
						$ne: true
					}
				}).count();	
			},
			currentUser() {
				return Meteor.user();
			}
		})
	}
	// newTask
	addTask(newTask) {
		// Insert a task into the collection
		Tasks.insert({
			text: newTask,
			createdAt: new Date,
			owner: Meteor.userId(),
			username: Meteor.user().username
		});

		// Clear form
		this.newTask = '';
	}

	// setChecked
	setChecked(task) {
		// Set the checked property to the opposite of its current value
		Tasks.update(task._id, {
			$set: {
				checked: !task.checked
			},
		});
	}

	// removeTask
	removeTask(task) {
		Tasks.remove(task._id);
	}
}



export default angular.module('todosList', [
	angularMeteor
	])
	.component('todosList', {
		templateUrl: 'imports/components/todosList/todosList.html',
		controller: ['$scope', TodosListCtrl]
	});