# Tutorial 7: Message nodes #

## Description ##

Have multiple agents sharing knowledge

## Adding a second agent ##

Let's start this tutorial by adding a second agent to the mix: the webpage is already designed to create two agents, the first one calling a behavior tree named "agent_0.bt", the second one calling "agent_1.bt". For now we only had "agent_0.bt" in our project, thus the creation of the second agent failed. So we just have to create a new behavior tree "agent_1" in the directory "bts/tutorials" where you already have your "agent_0.bt".

## Using the message nodes ##

To demonstrate the communication possibilities, we will use **craft ai** [messaging system](http://doc.craft.ai/behaviors/messages/index.html#the-messaging-system) to have our newly created Agent 1 send the list of capitals to our previously existing Agent 0.

In "agent_1.bt", add a [send message](http://doc.craft.ai/behaviors/messages/index.html#-span-class-craft-node-send-message-span-send-message-node) (<span class="craft-node-send-message"></span>) node and open its properties editor to set the channel to the string "cityMgr" and add a parameter named "content", with its source being the entry "capitals" from the instance knowledge.
This is all Agent 1 will do.

Now in "agent_0.bt", we have some changes to do in order to have the following behavior tree: 
![example 7](https://raw.githubusercontent.com/craft-ai/tutorials/master/doc/7/example7.png)

In more details, this requires to:

* replace the "set" node where we initialized "result" at the beginning of the top-level sequence, by a [subscribe message](http://doc.craft.ai/behaviors/messages/index.html#-span-class-craft-node-send-message-span-send-message-node) (<span class="craft-node-send-message"></span>) node with a channel set to the string "cityMgr";
* add a "sequence" node as the second child of the priority selector;
* add a [receive message](http://doc.craft.ai/behaviors/messages/index.html#-span-class-craft-node-receive-message-span-receive-message-node) (<span class="craft-node-receive-message"></span>) under this sequence, with a channel set to the string "cityMgr", and the "Content" field set to the "result" key of the agent knowledge;
* reparent the "until" node under the sequence, right after the "receive message" node;
* add a "stall" action as the second children of the priority selector.

This will allow our agent to receive messages on the "cityMgr" channel, and the priority selector node will prevents the behavior to fail if anything in the first branch fails (for example, the "receive message" node will fail when there is no message to retrieve on the channel).

One last thing: the list of capitals will now be available to Agent 0 when receiving the message from Agent 1, but it will be stored in the agent knowledge "result.content". To take this into account, we have to update the "GetFirstElement" action and replace all occurrences of "result" with "result.content" in its parameters (i.e. in the "array" input parameter and in the "capitals" output parameter).

> You can check the final result of this tutorial by running the application with `bts/7` as the `behaviors folder`.
