import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './todosList.html';
import { Tasks } from '../../api/tasks.js';

class TodosListCtrl {
	constructor($scope) {
		$scope.viewModel(this);

		this.helpers({
			tasks() {
				// Show newest tasks at the top
				return Tasks.find({}, {
					sort: {
						createdAt: -1
					}
				});
			}
		})
	}
	// newTask
	addTask(newTask) {
		// Insert a task into the collection
		Tasks.insert({
			text: newTask,
			createdAt: new Date
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