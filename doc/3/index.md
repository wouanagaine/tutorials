# Tutorial 3: Condition node #

## Description ##

Use the condition node to test the value of an entry of the agent's knowledge.

## Adding a condition to the behavior ##

In this tutorial we will use the [condition node](http://doc.craft.ai/tutorials/doc/3/index.html) (<span class='craft-node-condition'></span>) to test if the knowledge entry "answer" is different from an empty string. If so, we will execute the next child of the sequence, else the condition will fail and so will the sequence, thus skipping the "Say" action.
Simply drag a condition node from the palette to the canvas to have the following pattern:
![example tutorial 3](https://raw.githubusercontent.com/craft-ai/tutorials/master/doc/3/example3.png)
You will need to configure the condition node by double-clicking on it and set its properties as described below:
![condition properties](https://raw.githubusercontent.com/craft-ai/tutorials/master/doc/3/conditionProperties.png)

Once you have saved your behavior tree, you can run the tutorial once again. When prompted for an input, leave the field blank and submit the form. You will see that the pop-up will reappear even though nothing has been displayed on the page, which is the expected behavior since the condition `EK.answer!=""` is not verified (the condition node fails). However if you enter anything in the form and submit it, your text will be displayed thanks to the "Say" action that will be executed after the condition node.

> You can take a look at the expected result by running the application with `bts/3` as the `behaviors folder`.
