# Tutorial 2: Sequence node #

## Description ##

Use the sequence node to chain actions.

## Building the sequence in the behavior tree ##

In the "Tutorials" behavior tree that you previously created, drag the [sequence node](http://doc.craft.ai/behaviors/sequence/index.html) (<span class='craft-node-sequence'></span>) to the canvas, just above the "Say" action so that the sequence node becomes the parent of the action node. Drag another action node on the left of the "Say" action to have the following behavior tree:
![example 2](https://raw.githubusercontent.com/craft-ai/tutorials/master/doc/2/example2.png)
Set the leftmost action properties as described below:
![prompt action](https://raw.githubusercontent.com/craft-ai/tutorials/master/doc/2/prompt.png)
This "Prompt" action displays a pop-up window with an input field. On submission, the [agent knowledge](http://doc.craft.ai/knowledge/index.html#entity-knowledge) will be updated with the value of the input stored under the key "answer".
Now you can use this as an input for your "Say" action. Simply double-click on it, and replace the type of the `message` input by "Agent knowledge" and the value by "answer".
![say action](https://raw.githubusercontent.com/craft-ai/tutorials/master/doc/2/say.png)

Go to [the tutorial page](http://www.craft.ai/tutorials/): once connected to **craft ai** services, you will be prompted for a message to display. If you enter "Hi!" and hit "submit", the web page will display "Agent 0 says: Hi!", and the pop-up will reappear and so on.

> You can take a look at the expected result by running the application with `bts/2` as the `behaviors folder`.
