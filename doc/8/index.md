# Tutorial 8: Embedded nodes #

## Description ##

Organize and factorize your behavior trees through reusable subtrees

## Calling a subtree ##

In this tutorial we will get to the point where we can reproduce the same behavior as in the In [tutorial introduction](../0/index.html), that is, rather than having the Agent 1 sending a fixed list of cities, it will connect to the Reddit API and match the retrieved posts with the capitals from the city list and send to Agent 0 the successful matches.

But this time we won't define the complete behavior in the editor. Instead, we will take the easy way: we will simply call the behavior that has already been designed for the introduction! This can be done using the [embedded node](http://doc.craft.ai/behaviors/embedded_behavior/index.html) (<span class="craft-node-embedded-behavior"></span>).

Open your "agent_1.bt" and delete the "send message" node. Now drag and drop an embedded node and edit its properties: set the `Behavior Path` to the URI path "bts/tuto_reddit_manager.bt"
![example 8 agent 1](https://raw.githubusercontent.com/craft-ai/tutorials/master/doc/8/example8a.png)

By doing this, we are changing the content that is sent through the channel "cityMgr", thus the Agent 0 behavior must be adapted. As you probably guessed, using an "embedded node" will do the trick. You can just deactivate the current behavior tree by clicking on the button on the top-left corner of the root node of "agent_0.bt" to prevent its execution:
![deactivating a behavior](https://raw.githubusercontent.com/craft-ai/tutorials/master/doc/8/deactivate.png)

Then drag and drop an "embedded node" just beside the root node. Now you can set the behavior path of this embedded to "bts/tuto_city_manager.bt".
![example 8 agent 0](https://raw.githubusercontent.com/craft-ai/tutorials/master/doc/8/example8b.png)

That's it. Your behaviors will now reuse the predefined tutorials behavior, and everything will work as in the introductory tutorial. 

And if you are curious, go take a peek at this [blog article](http://www.craft.ai/blog/playing-with-embedded/) that will give you an insight into how **craft ai** embedded nodes can be used.

> You can check the final result of this tutorial by running the application with `bts/8` as the `behaviors folder`.