# Tutorial 6: Priority selector node #

## Description ##

Use the priority selector node to switch between behaviors depending on their status.

## Adding a selector to the behavior ##

In this tutorial we will use the [priority selector node](http://doc.craft.ai/behaviors/selectors/index.html#-priority-selector-node) (<span class='craft-node-priority-selector'></span>) to add another condition under which the repeating behavior under the "until" node should stop.

For example, we could stop the execution of the "until" node whenever the "GetCityWeather" action returns "scattered clouds" (which is referred to by the id 802 in the OpenWeatherMap API).
We will introduce a "priority selector" node in the behavior tree to do this. Drag one from the palette to the canvas, just beside the "until" node, and re-parent the "until" node below the "priority selector". Now we just need to add a condition as the first child of the "priority selector" node and edit its properties to verify the following predicate:
![condition properties](https://raw.githubusercontent.com/craft-ai/tutorials/master/doc/6/ConditionProperties.png)
Also, it is important to set the "priority selector" node to "active", so that it executes its first child (the condition) at every decision step.

At last, it is necessary to initialize the entity knowledge "weather.id", so that the predicate in the condition node can be tested. To do so, simply add a "set" node at the beginning of the high level sequence, setting the initial value of "weather.id" to 0.

In the end, the behavior tree should look like this:
![example 6](https://raw.githubusercontent.com/craft-ai/tutorials/master/doc/6/example6.png)

> You can check the final result of this tutorial by running the application with `bts/6` as the `behaviors folder`.
