# Ein

> **Note:** Ein is in alpha. The documentation is incomplete. There might be functionality not yet implemented that is documented as existing.

Ein is a reactive framework. An ein application consists of a [node](#nodes) holding and updating data. The nodes will stream the active model value. Those values can be defined into a finite state machine using the [router](#state-router), and be displayed using the [view](#view) and a [renderer](#renderer).

**Pronunciation:** /eɪn/ like in mane

## Ideas Behind the Framework

This framework is very opinionated about how things should work to minimize sources of error. The framework has a lot of boilerplate at the moment and at its core it will continue to have that. The need to actually write all of that for an application will be circumvented with helpers and with extensions for the IDE used.

### About the Model

The model for an Ein application is the only place that data is held. The view applied will be a representation of the model, there is no local state in any part of an application. The model should be defined for the entire application, but it might not always have all the data needed to display all parts of it. The model should be immutable to simplify checking for change. When a new model is created it's created by pure functions to simplify testing and verification of functionality. Actions are used to define what needs to be updated.

#### View Model

The model used by an application should be defined specifically for that application. Unless the backend is just pure data storage a view model should be created from the data retrieved externally. The view model should separated from the domain model and hold view specific data.  The view model should be molded from the domain model and will probably be very similar but adapted to view usage. The view model should hold actual values and avoid having values as `undefined` and prefer using default values. However do consider changing the domain model based on the needs of the view, it is after all logical to mold the model after what is being displayed to the user.

Keep the translation between the two models close to the data transfer, e.g. before setting the data in the router or before adding as a payload on an action. The reason for this is that any changes to the external models will only affect the functions converting between the two model types. Also send view models to the parts responsible for sending updates to the backend and let them be in charge of conversion.

If the view model isn't adapted to a view, either adapt the view model to fit all existing views or use an aggregate, either by using a [map](#maps) or a [translator](#translator). If a view needs a lot of data specific for layout consider creating a derivative, a render model, instead. The render model is created by the view model, it could of course be created as a property of the aggregate being sent to the view. Most of the time the render model should be the model given to the view.

##### Creating the View Model

The view should have its own model, but most likely it will be very similar to the domain model. It is also important to let the needs of the view help shape the domain model as well.

Transform the data received to simplify rendering of the view. For instance if there is a check on several properties to show a value aggregate them into a single property when sent to a view. Or transform an array to a more descriptive object.

Although it is important to remember to keep the parts that needs to go back to the backend as simple as possible to convert back. But be careful of adding several properties on the View Model for the same thing, the updating of the view model might get complex, instead deliver data by aggregation to the views.

### The Application View

The views should focus on layout and converting user interaction into understandable actions. There should be very little logic in the views and any calculations needed for layout will be done during the normal model updating process. Then the focus can be to just handle layout and design.

### No Local State

There should be no local state. All data needed should be in the model, and the views should render that. The only reason that local state should be needed is if the medium that the view is being presented in does not support what is needed for the view. That however is not the responsibility of the view to change. This is where an extension of the medium is needed. For HTML this would be Web Components. Writing a full Web Component just to add simple functionality is typically too much work, therefore there is a shorthand way to extend the media with [components](#components) and [extenders](#extenders). They are simple but should be enough for most use cases.

### Communication

Communication with the back end is separated from the handling of the model. An action should be created when new data has been received, perhaps already when data retrieval has been started. If the application is a SPA, the router should be used and be responsible for the lion's share of the data retrieval. Another handler should be used to use Actions to know when to persist data to the back end.

## Nodes

The model of the application is contained inside a node, the root node. The node will send out a stream of model values when the model has been updated. If there are parts of the model that are separated or easily boxed in a [child node](#creating-a-child-node) can be created to be responsible for just that part of the model. That node and any consumer of it can be oblivious to the rest of the application. The root node model will be updated when the child node updates. The child nodes can be considered transient and can be created on demand to handle updates to a part of the model data.

A node is comparable to both the controller and the model of a typical MVC. It is responsible to inform of the current model value and also to broker updates. Handling charges to the model value is the responsibility of the implementation of the [actionMap](#actionmap) responding to [actions](#actions). The actual updating of data is done by the parent node giving it the option of reacting to, or modifying the data. The update will be passed up through each parent until it reaches the root node, that will then send the updated model.

### Creating the Root Node

To create the root node use the `create` function. Supply an [actionMap](#actionmap) and an initial value for the model. The type argument is the model interface.

```typescript
  const node: Node<Example> = create(exampleMap, {example:'Hello World'});
```

### Getting the Model Value

A node will send an update after an action has been mapped to a new value by the [actionMap](#actionmap). Subscribe to the node to get model updates, it is possible to have multiple subscriptions to the same node.

```typescript
  node.subscribe((model: Example) => {
    // handle update.
  });
```

The current value of the node's model is also available.

```typescript
  const v: Example = node.value;
```

### Actions

An action describes an update to the model. It is used by the [actionMap](#actionmap) to create a new model value, so they should carry all the information needed to update the model. The implementation of the actions only require a `type` property of string type and can have any other properties.

Actions are mapped by calling next on a node.

```typescript
const action: ExampleAction = node.next({type: 'EXAMPLE', value:'hello world'});
```

Next will return the mapped action, or something from a [middleware](#middleware).

> **Note:** See [nodeAsync](#nodeasync) for a way of handling async actions by sending observables directly on next.

### Creating a Child Node

Parts of the model can picked out and a node can be created for that specific part of the model. This can be useful to let components be oblivious about the application as a whole and only see the part of the model it handles. There is no limit on how many children that can be created on a model property. The Actions mapped in a child will be sent to the parent node, so that the parent can [react](#triggermap) to a change in the child. The update will only be sent to the node that spawned the child, not to all nodes handling that part of the model. The actions will however be sent all the way up to the root node. The same goes for the model value, it will go all the way up to the root node and then be updated as a part of the entire model.

Create a child by specifying an actionMap and which property of the model that will be watched.

```typescript
  const child: Node<ExampleChild> = node.createChild(actionMap, 'child');
```

Alternatively a [translator](#translator) can be specified to get the part of the model that's needed, or to create an aggregate model.

```typescript
  const child: Node<ExampleChild> = node.createChild(actionMap, childTranslator);
```

If the model being watched is removed or if the translator returns `null` the child node will be completed. After it has been completed a new one will have to be created to watch that part of the model again. This also means that if the model is `null` when creating the child it will immediately be completed and  unsubscribe from its parent. That can in turn [complete the parent](#unsubscribing).

#### Unsubscribing

The nodes have a reference count on the active subscriptions, when there is no more active subscriptions the node will complete and will no longer send any updates. This means if one subscription should be unsubscribed and a new one added it is important to add the new subscription first. If not the node might be completed when the first subscription is unsubscribed.

### Translator

A translator should be able to get a model property and to be able to return that to the model. The translator can be used to create computed values, consisting of multiple properties or a derivative of properties, from the model and serve to a child.

#### `get:(m: T) => U | null`

The get function of the translator gets the value from the model. If it can't, return `null`.

#### `give:(m: T, mm: U) => T`

The give function sets the value back on the model.

### ActionMap

```typescript
(model: T, action: Action) => T
```

The action map is responsible to create a new model value in response to an [action](#actions). It should be a pure function that takes a model and an action and returns a new model, or the same object if nothing was changed by the action. Only return a new object if the action actually produced a result.

> **Note:** Since a new object is returned make sure use an id property on the objects to identify them.

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

After an action has been mapped in a [child](#creating-a-child-node) that action is sent to the trigger map for the parent. Actions created by trigger maps are mapped directly and as a part of the current update. Actions from all children are sent to the parent all the way up to the root node.

A trigger map should take a model and an action and return an other action. Should return `null` for no result.

```typescript
triggerMap(model: Example, action: ExampleAction): ExampleAction | null {
  if (action.type === EXAMPLE_TYPE) {
    return {type: 'TRIGGERED_FOR_EXAMPLE'}
  }

  return null;
}
```

In order to use a `trigger map` send in an `ActionMaps` when creating the node. ActionMaps is a container that holds the action map and a trigger map.

```typescript
const node: Node<Example> = create({
actionMap: exampleMap,
triggerMap: exampleTrigger
}, {example:'Hello World'});
```

### Middleware

Middleware is code that can be added to the process of executing an action. Can be useful for data retrieving or tracing. This has been inspired by redux solution for middleware. Middleware functions are called with by the previous one. The first gets the action supplied to [next](#actions) and the last middleware will supply the action to the [map](#actionmap). Any middleware can cancel the action by not calling the following function.

#### Adding

To add middleware call `withMiddleware` with the middleware or middlewares. Then call [create](#creating-the-root-node). `Middlewares` is a container for two different middleware one for the normal execution and one for the actions created by the trigger map for a node.

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

This is the middleware function that will be called during [next](#actions). The functions available are `value`, that returns the current model value, and `next`, that allows another action to be sent for execution. Make sure to only use `value` and `next` from within the middleware. An action can be canceled by not calling `following`.

##### For Trigger

This middleware is similar, but it doesn't support returning. The value supplied is the transient model that is making its way up the chain and might be changed in higher up in the chain. Cancel by not calling following. Canceling will only cancel this action, the one that was created, and not any other actions that might be triggered later, by this action or another.

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

Type inference isn't working properly when using mixins the types must be explicitly stated or the result cast to the correct type.

```typescript
const node: MyNode<Example> = <Example, MyNode<Example>> withMixins...
```

```typescript
const node: MyNode<Example> = withMixins... as MyNode<Example>
```

Unfortunately at the moment the type returned from [`createChild`](#dividing-a-node) isn't correct if mixins are used the result must be explicitly cast.

```typescript
const child: MyNode<ExampleChild> = node.createChild... as MyNode<ExampleChild>
```

#### Creating

A mixin is a function that creates a class extending Node, note that this might be another mixin. If the signature of a method or if Node is extended with additional functionality supply an interface that extends Node. Make sure to handle the old method signature by checking the parameters and sending to super if they can't be handled.

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

These mixins are included in Ein.

### NodeAsync

This mixins adds handling of observables of actions to `next`. It is used by [view](#view) and is applied if a view is used.

#### Asynchronous Actions

When something asynchronous have to be handled send in an observable of actions to `next`. It should never error so if it's mapped from another observable, catch any errors. It will map all actions that are sent until completed.

```typescript
node.next(httpLib.get('example')
                  .map(responseToAction)
                  .catch(errorToAction));
```

##### Middleware

Each action in the observable will go through the normal action flow and will be passed through any middleware used.

```typescript
const actions: Observable<ExampleAction> = httpLib.get('example')
                                                   .map(responseToAction())
                                                   .catch(errorToAction());

node.next(actions$);
```

### NodeSelect

### NodeChildList

#### Triggering Asynchronous actions

Add a function called `triggerMapAsync` on the `actionMaps`. Then an observable can be triggered as a response to an action, in a similar way to triggering actions. This will also trigger for actions on the node the observable was registered on, not just on parents. Any observable created will be subscribed to after the action that triggered it has completed. This means that the action has completed fully, i.e. the updates have bubbled up to the root node, and all children have been given an updated model.

##### `triggerMapAsync: (model: T, action: A extends Action) => Observable<A> | null;`

A function that might return an observable of actions in response to a model and an action.

## State Router

> **Note:** Right now the router have to manually hooked up using the temporary return values from createStates.
> **Note:** There are some features missing in the router at the moment

The state router is a way to define a number of states for the model. It simplifies moving between different model states, and can retrieve data needed to update the model for a new state and define rules for moving between states. The state router uses actions to move between different states. These can be used to update the model data needed for different states.

The states are added in an array containing `StateConfig` or `RuleConfig`.

### States

States for the model are defined in a `StateConfig` defining a name any data needed for the state and rules for entering and leaving the state.

```typescript
{
  name: string;
  children?: StateConfig[];
  data?: Dict<(model: any, state: State) => Observable<any>>;
  canEnter?: (model: Value) => Observable<boolean | Prevent | Action>;
  canLeave?: (model: Value) => Observable<boolean | Prevent>;
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

An optional function returning an observable of a boolean, a [prevent](#prevent) or an [Action](#actions). If a `false` or a prevent is returned the transition will be prevented, and a [`TransitionPreventedAction`](#transition-prevented-action) will be sent. If an Action is returned that action will be sent on next instead of the TransitioningAction that would be sent otherwise. It can be useful to do a transition to an other state or to set the model in an other way.

```typescript
(model: any) => Observable<boolean | Prevent | Action>;
```

#### `canLeave`

An optional function returning an observable of a boolean or a [prevent](#prevent). If a `false` or a prevent is returned the transition will be prevented, and a [`TransitionPreventedAction`](#transition-prevented-action) will be sent.

```typescript
(model: any) => Observable<boolean | Prevent>;
```

#### Prevent

A prevent is an object used to prevent moving to or from a state.

```typescript
{
  reason?: string;
  code?: number;
}
```

The added properties will be added to the TransitionPrevented action returned on.

#### `children`

A state can have sub states that relies on the parent state. Child states work the same as other states except that the parent states will load first. So when moving to a child state all parent states will load first. When moving between siblings the parent state will not be loaded again.

> **Note:** If any parent state prevents entering, or leaving, this will stop the transition. So that the transition might not reach the target state even though that state allows entering.

### Rules

Rules are used to group a number of states together with a [canEnter](#canenter). This can be useful to group states that are only accessible for specific circumstances such as being logged in.

```typescript
{
  canEnter: (model: Value) => Observable<boolean | Prevent | Action>;
  states: Array<RuleConfig | Config>;
}
```

A rule can have additional rules as children.

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

If something goes wrong during the transition, such as data retrieving failure or a problem with `canEnter`. It will contain a code and a reason for the failure. If the failure was caused by an error that error object will be included as well.

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

### Browser Views

There are two views that can be added with the router. They should only be considered as such and not part of the router. They show a representation of the current model value and allow for user interaction.

#### Url

If a `path` property is added to the StateConfig the url will change based on this path. The url should only be viewed as a representation of the model state and to simplify linking into the application.

The url will update based on the current model state. Back and forward button interaction will result in transition actions being sent. It will also translate the url on initial load to a transition action.

##### `path`

> **Note:** The path must be prefixed with a `/` to correctly translate the url on initial load to an action.

The path is a string built up by segments. A segment consists of a  `/` followed by a string. If the string is prefixed by `:` that segment will become a variable and will be read from the StateParams. E.g. if `/:id` is added, it will be read as the property `id`. It will also be added to the StateParams for the action created on initial load. If there are parameters in the StateParams that doesn't exist in the path they will be added as query parameters to the url. A variable can be turned optional by suffixing `?` to the variable segment. Optional variables can only be followed by other optional variables.

```typescript
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

### HTML-render extenders

> **Note:** At the moment they will be available on the temporary return value from `createStates` as `link` and `linkActive`.

There are two [extenders](#extenders) defined to help using the router in the HTML medium. They rely on `path` being defined for the states.

#### Link `e-link`

Expects a string that is equal to a `path` for a state. Clicking the element will send a [Transition Action](#transition-action).

If added on an `<a>`-element the extender will create a href-attribute that will link to the state and can be opened in a new window.

#### Link Active `e-link-active`

Must be used in conjunction with `e-link`. Expects a string formatted in the same way as the `class` attribute. The classes will be applied to the element when the state that is defined in `e-link` is active.

## View

> **Turn back now!**
>
> **Note:** At the moment the view will have to be hooked to the root node manually. The Async mixin must be added. A temporary function, initApp, is used to connect the view to the root node. All elements and maps are sent in as parameters to this function.

The view will generate a representation of the model, which can be presented in a medium through a renderer. At the moment only a HTML renderer is available. The view is applied as a map on the root nodes model updates so that each state update will result in an updated view. That view will den be sent to the renderer.

### Views

Views the responsibility of a view is to render the model and to react to user input. Views are used by using the `name` of the view as an element. Views consists of a view template and an action select. Views are there to aggregate several view/element `actions` into fewer, meaning several buttons can result in one type of `action`. On the other hand this means that the `actions` needs to be resent if they are to reach a parent of the view. If this is not desirable us a [group](#groups) instead.

```typescript
view(name: string, template: string, actions?: (select: Select) => Observable<Action>)
```

The element created must be added to the 'initApp' function.

#### View Template

> **Note:** At the moment the view template must be a string.
>
> **Note:** tag and property names are case insensitive, but using lowercase is recommended.
>
> **Note:** Although the view template is HTML-like it will be converted into view objects and then rendered into HTML. This means that the rendered HTML might not look exactly the same as that entered in the template.

The view template is a html snippet describing the content of the view containing templates that will be replaced by values from the model. Templates are used to get model data into the view template. They can be used in text or in property values.

##### Model value

If a model value should be included in the template surround the value with `{{` and `}}`. This will use the model available for the view. So `{{model.property}}` will output that property on the model as a string. A shorthand can be used to access the properties directly `{{property}}` will also select that property on the model. To use the model directly, `{{model}}` can be used.

#### Inserted Content

> **Note:** At the moment a view can't prevent content from being added. If no `<e-slot>` element is present in a view template, child elements will be added after the view template.

When being used in another view, content can be added to the view element. That content will be added inside the slot.

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

#### Maps

Maps are functions used in view templates to transform model data to display in the view. It takes one or more arguments, the additional arguments are used from the view template, so they cannot be of `object` type.

Avoid using maps if possible. Since the model given to the view is meant for that view most of the time it should  hold the correct data already. The usage for maps are to mold data going to a sub view, or to handle things that can be cumbersome to handle in the model, such as a dynamically changing language setting.

```typescript
(model: Value, ...rest: Array<Value>) => Value;
```

##### Using Maps

A [map](#maps) can be applied by using `=>` when using a model value. The current value from the model will be sent as the first parameter to the map, if the map requires additional parameters they are separated by `:`. Maps can be used in series, the return value from the preceding map will then be used as the first parameter to the following map. String parameters must use `""` or `''`.

```html
<span>{{property => map1:"param" => map2:true}</span>
```

#### Actions/Events

> **Note:** The view uses Action and not events, but they can be viewed as essentially the same thing and the events that are used in the view should be in a direct response to a user action. If there is a need to react to other native events consider creating a [component](#components)
>
> **Note:** The HTML renderer will send native events as actions.

The views uses [Actions](#actions) for user interactions, they can be used directly in an action map. This is what happens automatically with a [node view](#node-view). Therefore its wise to always create Actions that are ready to be used in an action map if possible.

A view may return an action stream if it needs react to user interaction. When creating a view, a function can be added as an argument. That function should return an observable of actions for the view. That function will be supplied a `select` that is used to subscribe to actions of the child elements in the view template, either as native events or as actions if it is another view.

> **Note:** A helper will be created to avoid having to combine all selects to one stream.

```typescript
(select: Select) => Observable<Action>
```

Actions are selected on the action stream by a simplified css-selector and an action type. No elements inside an other view can be selected.
The selector can contain element, id or class, or a combination of these: `element#id.class1.class2`. No child selectors can be used. The selector is evaluated on every model change so if classes change actions might not be received any more.

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

The type returned here can be used to select actions from other views in the view.

### Using views

All registered views can be used inside other views by using an element with the view name.

```html
<view-element></view-element>
```

Elements added to the view will belong to the parent view. This means that any templates used will be using the parent views model. However the elements added to a view will be available for action registering for that view.

### Styling views

Views for an application should be viewed as one and the entire application should be styled as one. Therefore there are no stylesheets bound to views.

#### Properties

Properties can be set on the elements, they can hold any value from the model. In the HTML renderer they will be converted to HTML attributes and the values will be turned into string. In the view they can be used by [modifiers](#modifiers) to manipulate the element.

#### Custom Properties

There are a few custom properties available to help handling the data. If the value in the property should be based on a model value surround the entire value with `{{` and `}}`.

##### e-model

> **Note:** This value must be a string of the format `child.grandchild.value`.

Will change the value of `model` for the **children** of the element.

##### e-select

> **Note:** This value must be a string of the format `child.grandchild.value`.

Will change the property of `model` for a node-view.

##### e-if

Hides and shows the element based on the value.

##### e-for

> **Note:** Only arrays at this point, not any Iterable.

Iterates over an array and creates an element for each value using the corresponding array-element as `model` for the element.

#### Elements

Custom elements available by default in the view template.

##### e-slot

This element controls where elements added to a child view inside a view template will render inside that [view](#inserted-content).

##### e-group

Groups a number of elements so that they can be repeated or made conditional as one. The `<e-group>`-element will not show in the rendered output.

### Groups

Groups works differently from a view, they are a way to create reusable snippets of elements and views. The actions from elements inside the group is available to select for the view that is using the group. A group will be included without creating an element surrounding the children of the view template.

### Node View

A node view is similar to an ordinary view except that they work with a child node. The Action streamed returned from this view will be registered to the action map and result in updates to the model. The child node is created when the view is created and will spawn from the closest node above. This means that if a node view resides inside another node view, the child will be created from that views node.

```typescript
nodeView<T>(name: string, template: string, actionMap: ActionMap<T>, actions: (select: Select) => Observable<Action>);
nodeView<T>(name: string, template: string, actionMaps: ActionMaps<T>, actions: (select: Select) => Observable<Action>);
```

#### Setting the model

> **Note:** Using [translators](#translator) is not yet supported.

To set the child model

### Modifiers

> **Note:** Custom modifiers are not yet supported.

Used to change how template elements work. They are used for internal functionality such as [conditinals](#e-if) and [repeaters](#e-for). Typically no custom modifiers should be needed.

## HTML Renderer

A renderer is used to display the view in a medium. At the moment there is only one renderer, an HTML renderer. Its use is hard coded into init app.

### Components

> **Note** At the moment components are added through the initApp functions but are actually bound to the renderer used.
>
> **Note** Components lack life-cycle events at the moment, wait until the next event loop after init to access content. There is no helper to select events of the content at the moment.

A Component is a way to extend the medium the view is being displayed in. For HTML they are a shorthand for using WebComponents. They are used to add functionality needed by the view, but that's not supported by the medium of the renderer.

```typescript
component<T>(name: string, template: string, initiateComponent: InitiateComponent<T>)
```

#### View Template

A component uses the same template as a [view](#view-template), with the difference being that a components view template will get properties instead of a model.

#### Inserted Content

Components can have a slot as well and content can be inserted into components. Elements inserted this way will be available for [selecting](#select) but their content will be filled using the parents model.

#### Initiate Component

This function is used to create the component, i.e. creating streams for native events or elements and giving access to an update function.

```typescript
(element: Element, updateContent: () => void) => InitiateComponentResult
```

##### element

The HTML Element of the component.

##### updateContent

The content will be rendered any time the properties on the component changes. If a [map](#map) is used to supply extra properties to the view, it might be desirable to update at another time. This function renders the content of the component.

##### Return Value

```typescript
{
  events?: Observable<Event>;
  map?: (properties: Dict<string | number | boolean>) => Dict<string | number | boolean>;
  onBeforeDestroy?: () => void;
}
```

###### events

The `events` property should be returned if the component should communicate to views. This is regular HTML Events and should be created by using `New Event('custom')`.

###### map

The `map` property can be used to add additional properties to the object that's sent to the view template to create a new view.

###### onBeforeDestroy

The `onBeforeDestroy` function will be called before the component is destroyed, it will be called before the renderer removes the native element representing the component.

#### Styling components

> **Note:** This might change in the future, giving components their own style sheets.

Components does not have any style sheets bound to them, they are short hand and therefore bound to this application and should be styled the same way as views.

### Extenders

Extenders are used to add functionality to an existing HTML element.

```typescript
extender(name: string, initiateExtender: InitiateExtender): ExtenderDescriptor
```

Name is the name of the attribute that will apply the extender to an element.

#### InitiateExtender

This function is used to initiate the extender, it will be given the native element it will be applied on.

```typescript
(element: Element) => InitiateExtenderResult;
```

##### Return Value

```typescript
{
  update: (newValue: Value | null,
           oldValue: Value  | null | undefined,
           properties: Property[]) => void;
  onBeforeDestroy?: () => void;
}
```

Update will be called every time the value changed. The properties are view properties and are not just the strings that are held in the renderers attributes. The first time update is called `oldValue` will be `undefined`.

The onBeforeDestroy function will be called when the element that the extender was applied to is about to be removed from the DOM and destroyed, the extender will not be called again and should do all preparations needed for garbage collection.
