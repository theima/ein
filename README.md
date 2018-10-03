# Ein

**Note:** Ein is in alpha. It is very verbose at the moment. The documentation is incomplete and can be incorrect.

Ein is a reactive framework. The model is a definition of an ein application. The model is built by one or more nodes that will stream model states, the currently populated model. 

**Pronunciation:** /eɪn/ like in mane


## Model
The model is an hierarchical reactive state system. It utilises an immutable data model. The idea is to have one place (the root node) to store the application model state.

The application model consists of a root node which holds all data that currently is needed by the application. If there are parts of the model that are separated or easily boxed in a [child node](#dividing-a-node) can be created to be responsible for just that part of the model. That node and any consumer of it can be oblivious to the rest of the application. The root node model will be updated when the child node updates. The child nodes can be considered transient att can be created on demand to handle updates to a part of the model data.

A node is comparable to both the controller and the model of a typical MVC. It is responsible to inform of the current state and also to broker updates. Handling actions is the responsibility of the implementation of the [actionMap](#actionmap) responding to [actions](#actions).


### Creating the Root Node
To create the root node use the `create` function. Supply an [actionMap](#actionmap) and an initial value for the model. The type argument is the model implementation used.

```typescript
  const node: Node<Example> = create(exampleMap, {example:'Hello World'}); 
```

### Getting the Model Value
A node will send an update after an action has been mapped to a new model has been created by the [actionMap](#actionmap). Subscribe to the node to get model updates, it is possible to have multiple subscriptions to the same node.

```typescript
  node.subscribe((model: Example) => {
    // handle update.
  });
```
The current value of the node is also available.

```typescript
  const v: Example = node.value;
```

### Actions
An action describes an update to the model. It is used by the [actionMap](#actionmap) to create a new state for the model, so they should carry all the information needed to update the model. The implementation of the actions only require a `type` property of string type and can have any other properties.

Actions are mapped by calling next on a node.

```typescript
const action: ExampleAction = node.next({type: 'EXAMPLE', value:'hello world'});
```

Next will return the mapped action, or something from a [middleware](#middleware).

**Note:** See [node-async](#node-async) for a way of handling async actions by sending observables directly on next.

### Dividing a node

Parts of the model can picked out and a node can be created for that specific part of the model. This can be useful to let components be oblivious about the application as a whole and only see the part of the model it handles. The Actions mapped in a child will be sent to the [create](#create) method of the parent node, so that the parent can react to a change in the child. The update will only be sent to the node that spawned the child, not to all nodes handling that part of the model. The actions will however be sent all the way up to the root node.

Create a child by specifying an actionMap and which property of the model that will be watched. sub-properties can be selected down to five levels.
 
```typescript
  const child: Node<ExampleChild> = node.createChild(actionMap, 'child'); 
```

Alternatively a [translator](#translator) can be specified to get the part of the model that's needed.

```typescript
  const child: Node<ExampleChild> = node.createChild(actionMap, childTranslator);
```

If the model being watched is removed or if the translator returns `null` the child node will be completed. After it has been completed a new one will have to be created to watch the model again.

#### Disposing
When a child is no longer needed its `dispose` method must be called.

```typescript
  child.dispose();
```

### Translator
A translator should be able to get a child model and to be able to return that to the model. The translator can be used to create computed values of the model and serve to a child.

#### `get:(m: T) => U | null`
The get function of the translator gets the child model from the model. If it can't, return `null`.

#### `give:(m: T, mm: U) => T`
The give function sets the child model back on the model.

### ActionMap
```typescript
(model: T, action: Action) => T
```

The action map is responsible to create a new model state is response to an [action](#actions). It should be a pure function that takes a model and an action and returns a new model, or the same object if nothing was changed by the action. Only return a new object if the action actually produced a result.

**Note:** Since a new object is returned make sure use an id property on the objects to identify them.


```typescript
map(model: Example, action: ExampleAction): Example {
  if (action.type === EXAMPLE_TYPE) {
    return Object.assign({}, model, {example: 'example'});
  }
  return model;
}
```

### TriggerMap
```typescript
(model: T , action: Action) => Action | null
```
A trigger map gives a parent node a chance to react to a change of a child. it is responsible for creating actions based on the action mapped in a child node or any node lower in that chain. Having a trigger is optional.

After an action has been mapped in a [child](#dividing-a-node) that action is sent to the trigger map for the parent. Actions created by trigger maps are mapped directly and as a part of the current update. Actions from all children are sent to the parent all the way up to the root node.

A trigger map should take a model and an action and return an other action. Should return `null` for no result.

```typescript
triggerMap(model: Example, action: ExampleAction): ExampleAction | null {
  if (action.type === EXAMPLE_TYPE) {
    return new ResponseAction(model);
  }

  return null;
}
```

In order to use a `trigger map` send in an `ActionMaps`when creating the node. ActionMaps is a container that holds the action map and a trigger map .

```typescript
const node: Node<Example> = create({
actionMap: exampleMap,
triggerMap: exapleTrigger
}, {example:'Hello World'});
```

### Middleware
Middleware is code that can be added to the process of executing an action. Useful for example for tracing. This has been inspired by redux solution for middleware. Middleware functions are called with by the previous one. The first gets the action supplied to [next](#actions) and the last middleware will supply the action to [map](#actionmap
). Any middleware can cancel the action by not calling the following function. 

#### Adding
To add middleware call `withMiddleware` with the middleware or middlewares. Then call [create](#creating-the-root-node). Middlewares is a container for two different middleware one for the normal execution and one for the actions created by the trigger map for this node..

```typescript
const node: Node<Example> = withMiddleware(middleware1, middleware2).create(exampleActionMap, {example:'Hello World'}); 
```

#### Creating
A middleware should be a pure function. There are two types of middleware, one is applied to the regular process of executing an action ([next](#next)), which includes executing of the action and any actions created by the trigger map. The other type is applied to the execution of a triggered action ([for-trigger](#for-trigger)) and it's limited in what it can do.

##### Next
 ```typescript   
 (next: (action: A) => A, value: () => any) => (following: (action: A) => A) => (action: A) => A
 ```
 
This might look a little daunting, but let's break it down.
 
 ```typescript 
 function middleware(next, value) {
   return (following) => {
     return (action) => {
       log('initial:', value();
       log('action: ', action.type);
       const result = following(action);
       log('new:', value();
       return result;
     }
   }
 }
 ```
This is creating a middleware that will log out some info about the execution. 
 
 ```typescript
 function middleware(next, value) {
   ...
 }
 ```
 
The first function is there to give access to `next` and `value` on the node. 
 
 ```typescript
 return (following) => {
   ...
 }
 ```
The function returned from the first function will supply the function following this middleware. This might be another middleware or the function executing the action and updating the model.
 
 ```typescript
 return (action) => {
   log('initial:', value();
   log('action: ', action.type);
   const result = following(action);
   log('new:', value();
   return result;
 }
 ```
 
This is the middleware function that will be called during [next](#actions). The functions available are `value`, that returns the current model, and `next`, that allows another action to be sent for execution. Make sure to only use `value` and `next` from within the middleware. An action can be canceled by not calling `following`.
 
##### For Trigger
This middleware is similar, but it doesn't support returning. The value supplied is the transient model that is making its way up the chain and might be changed in higher up in the chain. Cancel by not calling following. Canceling will only cancel this action and not any other actions that might be triggered later, by this action or another.
```typescript      
(value: () => any) => (following: (action: A) => void) => (action: A) => void;
```


```typescript
function middleware(value) {
  return (following) => {
    return (action) => {
      log('initial:', value();
      log('action: ', action.type);
      following(action);
      log('new:', value();
    }
  }
}
```
If a trigger middleware is implemented it needs to supplied with a middlewares.

```typescript
{
  next: myMiddleware;
  trigger: myTriggerMiddleWare;
}
```

### Mixins
Mixins are used to change, or add to, the functionality of the nodes. Typically these won't have to be written for an application.

#### Adding
Since mixins will alter what is returned from create a type or interface is needed for the return value from create.

```typescript
export type MyNode =  MixinInterface1 & MixinInterface2
```

To add a mixin call `withMixins` with the mixins, then call [create](#creating-the-root-node) on that.

```typescript
const node: MyNode<Example> = withMixins(mixin1, mixin2).create(exampleMap, {example:'Hello World'});
```

If [middlewares](#adding) are needed as well, just call `withMiddleware` before calling create.

```typescript
const node: MyNode<Example> = withMixins(mixin1, mixin2).withMiddleware(middleware1, middleware2).create(exampleMap, {example:'Hello World'});
```

#### Problems
Type inference isn't working properly when using mixins the types must be explicitly stated  or the result cast to the correct type.

```typescript
const node: MyNode<Example> = <Example, MyNode<Example>> withMixins...
```

```typescript
const node: Mynode<Example> = withMixins... as MyNode<Example>
```
Unfortunately at the moment the type returned from [`createChild`](#dividing-a-node) isn't correct if mixins are used the result must be explicitly cast.

```typescript
const child: MyNode<ExampleChild> = node.createChild... as MyNode<ExampleChild>
```

#### Creating

A mixin is a function that creates a class extending Node, note that this might be another mixin. If the signature of a method or if Node is extended with additional functionalitysupply an interface that extends Node. Make sure to handle the old method signature by checking the parameters and sending to super if they can't be handled.


```typescript
function mixin(node) {
  return class extends node {
    private _lastAction;
    public get lastAction() {
      return this._lastAction;
    }
    public next(action) {
      this._lastAction = action;
      super.next(action);
    }
  }
}
```

## Mixins
!!!
### NodeAsync
This mixins adds handling of observables of actions to `next`. It is used by [view](#view).
#### Asynchronous actions
When something asynchronous have to be handled send in an observable of actions to `next`. It should never error so if it's mapped from another observable, catch any errors. It will map all actions that are sent until completed.

```typescript
node.next(httpLib.get('example')
                     .map(responseToAction)
                     .catch(errorToAction));
```


#### Middleware
Each action in the observable will go through the normal action flow and will be passed through any middleware used.


```typescript
  const actions: Observable<ExampleAction> = httpLib.get('example')
                                                     .map(responseToAction())
                                                     .catch(errorToAction());
  
  node.next(actions$);
```
##### Triggering Asynchronous actions
Add a function called `triggerMapAsync` on the `actionMaps`. Then an observable can be trigger as a response to an action, in a similar way to triggering actions. This will also trigger for actions on the node the observable was registered on, not just on parents. Any observable created will be subscribed to after the action that triggered it has completed. This means that the action has completed fully, i.e. the updates have bubbled up to the root node, and all children have been given an updated model.

###### `triggerMapAsync: (model: T, action: A extends Action) => Observable<A> | null;`
A function that might return an observable of actions in response to a model and an action.


## State Router

**Note:** Right now the router have to manually hooked up using the temporary return values from createStates.

The state router simplifies moving between different model states. It can retrieve data needed to update the model for a new state and define rules for moving between states. The state router uses actions to move between different states. These can be used to update the model data needed for different states.

The states are added in an array containing `StateConfig` or `RuleConfig`.

### States
States for the model are defined in a `StateConfig` defining a name any data needed for the state and rules for entering and leaving the state.

```typescript
{
  name: string;
  children?: StateConfig[];
  data?: Dict<(model: any, state: State) => Observable<any>>;
  canEnter?: (model: object) => Observable<boolean | Prevent | Action>;
  canLeave?: (model: object) => Observable<boolean | Prevent>;
}
```

#### `name`
The name of the state, used in [Transition Action](#transition-action) to route to the new state.

#### `data`

An optional object containing one or more functions for returning data. The function will be called with the current model state and the current router state and should return an observable for the data. This will result in an object containing the values of the observables on the [Transitioned Action](#transitioned-action).

```typescript
(model: Example, state: State) => Observable<any>;
```

The first value from the observable will be used, all other values will be ignored. 

#### `canEnter`
An optional function returning an observable of a boolean, a [prevent](#prevent) or an [Action](#actions). If a `false` or a prevent is returned the transition will be prevented, and a [`TransitionPreventedAction`](#actions-2) will be sent. If an Action is returned that action will be sent on next instead of the TransitioningAction that would be sent otherwise. It can be useful to do a transition to an other state or to set the model in an other way.

```typescript
(model: any) => Observable<boolean | Prevent | Action>;
```

#### `canLeave`
An optional function returning an observable of a boolean or a [prevent](#prevent). If a `false` or a prevent is returned the transition will be prevented, and a [`TransitionPreventedAction`](#actions-2) will be sent.

```typescript
(model: any) => Observable<boolean | Prevent>;
```

#### `children`

A state can have sub states that relies on the parent state. Child states work the same as other states except that the parent states will load first. So when moving to a child state all parent states will load first. When moving between siblings the parent state will not be loaded again.

**Note:** If any parent state prevents entering, or leaving, this will stop the transition. So that the transition might not reach the target state even though that state allows entering.

#### Prevent 

A prevent is an object used to prevent moving to or from a state. 

```typescript
{
  reason?: string;
  code?: number;
}
```

The added properties will be added to the TransitionPrevented action returned on a prevent.

### Rules

Rules are used to group a number of states together with a [canEnter](#canenter). This can be useful to group states that are only accessible for specific circumstances such as being logged in. 

```typescript
{
  canEnter: (model: object) => Observable<boolean | Prevent | Action>;
  states: Array<RuleConfig | Config>;
}
```

a rule can have additional rules as children. 

### Views

There are two views that can show a representation of the model state.

#### Url
If a `path` property is added to the StateConfig the url will change based on this path.. This is listed under views because it should be regarded as such. The url should only be viewed as a representation of the model state and to simplify linking into the application. 

The url will update based on the current model state. Back and forward button interaction will result in transition actions being sent. It will also translate the url on initial load to a transition action.

##### `path`

**Note:** The path must be prefixed with a `/` to correctly translate the url on initial load to an action.

The path is a string built up by segments. A segment consists of a  `/` followed by a string. If the string is prefixed by `:` that segment will become a variable and read from the StateParams. E.g. if `/:id` is added, it will be read as the property `id`. It will also be added to the StateParams for the action created on initial load. If there are parameters in the StateParams that doesn't exist in the path they will be added as query parameters to the url. A variable can be turned optional by suffixing `?` to the variable segment. Optional variables can only be followed by other optional variables.

```
path: '/example/:variable/:optional?'
``` 

##### Children
The path of children will be appended to the path of the parent state. So the url for a child state will be `https://example.com/parent/child`.

#### Title

If a `title` property is added on the StateConfig the document title will be updated for the states. The property must be added to all StateConfigs.
```typescript
title: string | (s: State) => string;
```
The title property can be a string or a function that returns a string based on the current State.

### Actions

There are a number of actions used during a transition to another state.

#### Transition Action

This is the action used to initiate a transition to a new state. It contains a name, the state that will be routed to. There also is an optional [params](#stateparams) that can be used to add additional data for the state.

```typescript
{
  type: 'EinRouterTransition';
  name: string;
  params?: StateParams;
}
```

#### StateParams

An object containing additional parameters for the [state](#state) being routed to.

#### State

Describes a state.

```typescript
{
  name: string;
  params: StateParams;
}
```

#### Transitioning Action

This action will be sent after canLeave and canEnter has been checked and the data has started to load. The from state will not be there for the initial route to the state.
```typescript
{
  type: 'EinRouterTransitioning';
  to: State;
  from?: State;
}
```

#### Transitioned Action

This action marks the completion of the routing. The data object will be populated by data if the `StateConfig` has defined it. The property will have the same name as when defined.

```typescript
{
  type: 'EinRouterTransitioned';
  to: State;
  from?: State;
  data: object;
}
```

#### Transition Prevented Action

If the action is prevented in canLeave or canEnter this action will be sent.
```typescript
{
  type: 'EinRouterTransitionPrevented';
  from?: State;
  to?: State;
  reason?: string;
  code?: number;
}
```

#### Transition Failed Action

If something goes wrong during the transition, such as data retrieving failure or a problem with canEnter. It will contain a code and a reason for the failure. If the failure was caused by an error that error object will be included as well.

```typescript
{
  type: 'EinRouterTransitionFailed';
  to?: State;
  from?: State;
  reason: string;
  code: number;
  error?: any;
}
```

## View

**Turn back now!**

**Note:** At the moment the view will have to be hooked to the root node manually. The Async mixin must be added. Use the initApp function. All elements and maps are sent in as parameters to this function.
  
**Note:** This part of the documentation is incomplete and can lack a lot of information.

The view will generate a HTML view of the model
  The view is applied as a map on the root nodes model updates so that each state update will result in an updated view.
  
### Maps
Maps are functions used in view templates to transform model data to display in the view. It takes one or more arguments, the additional arguments are used from the view, so they cannot be of `object` type.

``` 
(model: object | string | number | boolean, ...rest: Array<string | number | boolean>) => string | number | boolean;    
```

### Views
Views the responsibility of a view is to render the model and to react to user input. Views are used by using the `name` of the view as an element. Views consists of a view template and an event select. 
``` 
view(name: string, template: string, events?: (select: Select) => Observable<ViewEvent>) 
```

The element created must be added to the 'initApp' function.
#### View Template
**Note:** At the moment the template must be a string. 
**Note:** tag and attribute names are case insensitive, but using lowercase is recommended.

The view template is a html snippet describing the content of the view containing templates that will be replaced by values from the model. Templates can be used in text or in attribute values.

##### Template.
  A template is starts with `{{` and ends with `}}`. The template will use the model available for the view. So `{{model.property}}` will output that property on the model as a string. A shorthand can be used to access the properties directly `{{property}}` will also select that property on the model. To use the model directly, `{{model}}` can be used.
  
###### Using maps
  A [map](#maps) can be applied by using `=>`. The current value from the model will be sent as the first parameter to the map, if the map requires additional parameters they are separated by `:`. Maps can be used in series the value from the preceding map will then be used as the first parameter to the following map. String parameters must use `""` or `''`.
``` 
{{property => map1:"param"} => map2:true}    
```
 
##### Events.
A view can return an event stream if it can react to user interaction. When creating a view a function can be added as an argument. The event select function should return an observable of events for this view. That function will be supplied a `select` that is used to subscribe to events of the child elements in the views template. 
```typescript
(select: Select) => Observable<ViewEvent>    
```


Events are selected on the event stream by a simplified css-selector and an event type. No elements inside an other view can be selected.
The selector can contain element, id or class, or a combination of these: `element#id.class1.class2`. No child selectors can be used. The selector is evaluated on every model change so if classes change events might not be received any more.

```typescript
const stream = s.select('element#id.class1.class2', 'click').map(
    e => {
        return {
          type:'click',
          value:'example'
        }
    }
);
```

The type returned here can be used to select events from other views in the view.
    
##### Attributes

There are a few custom attributes available to help handling the data.
**Note:** At the moment these need to be fully wrapped with `{{ }}` meaning they work on model values, or mapped model values.
###### e-if
Hides and shows the element based on the value.
###### e-model
Will change the value of `model` for the **children** of the element.
######  e-for
**Note:** Only arrays at this point.
Iterates over an array and creates an element for each value using the corresponding array-element as `model` for the element.
##### Elements
##### <e-slot>
This element controls where elements added inside to a view inside a view template will render inside the view.
```html
<div class="content">
  <e-slot></e-slot>
</div>
```

```html
<example>
  <div>text</div>
</example>
```

will render as

```html
<example>
  <div class="content">
    <div>text</div>
  </div>
</example>
```
If no `<e-slot>` element is present child elements will be added after the view template.

### Node View
A node view is similar to an ordinary view except that they work with a child node. They return a stream of `actions` instead of events. The child node is created when the view is created and will spawn from the closest node above. This means that if a node view resides inside another node view, the child will be created from that views node.

``` 
nodeView<T>(name: string, template: string, actionMap: ActionMap<T>, actions: (select: Select) => Observable<Action>);
nodeView<T>(name: string, template: string, actionMaps: ActionMaps<T>, actions: (select: Select) => Observable<Action>); 
```
