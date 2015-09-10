# Tutorial 5: Until node #

## Description ##

Use the until node to repeat a behavior.

## Adding a loop to the behavior ##

In this tutorial we will use the [until node](http://doc.craft.ai/behaviors/until/index.html) (<span class='craft-node-until'></span>) in order to create a loop in the behavior, repeating the execution of a given branch until a specified condition is met.

First, we will need to initialize a couple of variables that we will use throughout the execution of the behavior tree. To do so we will place two [set nodes](http://doc.craft.ai/behaviors/set/index.html) (<span class='craft-node-set'></span>) under a new sequence. The first one will set the "result" entity knowledge to the value of the [global knowledge](http://doc.craft.ai/knowledge/index.html#global-knowledge) "capitals", which is an array of objects containing the name of countries and their capitals. The second "set" node will initialize the entry "answer.country" of the entity knowledge to an empty string.

Once this is done, add an `until` node after the `set` nodes, and put under the `until` node the sequence that you have built throughout the previous steps.
Now let's change the "Prompt" action and replace it with a "GetFirstElement" action which allows to pop out the first element of an array. We will use this action to iterate through the "result" array. The action should have the following parameters:
![get first element](https://raw.githubusercontent.com/craft-ai/tutorials/master/doc/5/GetFirstElementProperties.png)
You will also need to adapt a little bit the "Say", "GetCityWeather" and "DisplayCityWeather" actions and replace "answer" by "answer.name" in their input parameters.

At this point, your behavior tree should look like this:


You can run your behavior in [the tutorial page](http://www.craft.ai/tutorials/) and one by one each country will be displayed both in the left column and on the map with the current weather of its capital as an icon.

Now we can use the properties of the until node to change the condition under which the behavior should stop being executed. If we keep the default settings `true==false`, the condition will never be met and the until node will keep on running its child until it fails (which will happen when any action fails, because of a connection error to a web service for instance). But let's suppose that we want to browse all elements from "result" until the country found is "Belgium". This would be easy to do just by setting the left operand to the entity knowledge "answer.country" and the right operand to "Belgium".

One more thing: since the behavior tree restarts whenever its execution is over, adding the "Stall" action at the end of the highest sequence would allow to keep the execution in the "running" state, and prevent to start all over again. You can also add a "Say" action just before the "Stall" action, with a message stating that you've reached the end of your behavior.
![example 5](https://raw.githubusercontent.com/craft-ai/tutorials/master/doc/5/example5.png)

> You can check the final result of this tutorial by running the application with `bts/5` as the `behaviors folder`.
