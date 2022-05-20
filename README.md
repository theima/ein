# Archived

No longer worked on, due to lack of time.

# Ein

> **Note:** Ein is in alpha. The documentation is incomplete. There might be functionality not yet implemented that is documented as existing.

Ein is a reactive framework. An ein application consists of a [node](#nodes) holding and updating data. The node will stream the active model value. Those values can be defined into a finite state machine using the [router](#state-router), and be displayed using the [view](#view).

**Pronunciation:** /eɪn/ like in mane

## Ideas behind the framework

This framework is very opinionated about how things should work to minimize sources of error. The framework has a lot of boilerplate at the moment and at its core it will continue to have that. The need to actually write all of that for an application will be circumvented with helpers and with extensions for the IDE used.

### No local state

There should be no local state. All data needed should be in the model, and the views should render that. The only reason that local state should be needed is if the [medium](#medium) that the view is being presented in does not support what is needed for the view. That however is not the responsibility of the view to change.

### Medium

A medium is where the view is being presented, in this case HTML. If the medium is not enough to do everything the view want an extension of the medium is needed. For HTML this would be Web Components. The medium for the view then becomes HTML + any WebComponents used.

Writing a full Web Component just to add simple functionality is typically too much work for an application, therefore there is a shorthand way to extend the media with [components](#components) and [extenders](#extenders). They are simple but should be enough for most use cases needed to extend HTML.

## About applications

An application is a collection of views and a model. A [router](#state-router) can be used to handle the different state of the application.

### About the model

The model for an Ein application is the only place that data is held. The model should be defined for the entire application, but it might not always have all the data needed to display all parts of it. The model should be immutable to enable simple change checks. When a new model is created should be created by pure functions to simplify testing and verification of functionality. Actions are used to define what needs to be updated.

#### Model data

The model of the application is contained inside a [node](#nodes), the root node. The node will send out a stream of model values when the model has been updated. If there are parts of the model that are separated or easily boxed in a [child node](#creating-a-child-node) can be created to be responsible for just that part of the model. That node and any consumer of it can be oblivious to the rest of the application. The root node model will be updated when the child node updates. The child nodes can be considered transient and can be created on demand to handle updates to a part of the model data. In an application child nodes are created by defining a specific [view](#node-view).

### Communication

Communication with the back end is separated from the handling of the model. An action should be created when new data has been received, perhaps already when data retrieval has been started. If a router is used it should be responsible for the lion's share of the data retrieval. Another handler should be used to use Actions to know when to persist data to the back end. Those handlers should typically be applied through a [middleware](#middleware).

### The application view

The views should focus on layout and converting user interaction into understandable actions. There should be very little logic in the views and any calculations needed for layout will be done during the normal model updating process. Then the focus can be to just handle layout and design.

#### Views

The view will generate a representation of the model. The view is applied as a map on the model it is tasked to present. Each model update will result in an updated view.

The view is built by creating a Template using `TemplateElements` which will be transformed into functions that take a model value and applies that to the HTML.

The responsibility of a view is to visualise the model and to react to user input. Views are used by using the `name` of the view as an element. Views consists of a view template and a function to create actions from user interactions or from action sent from contained views.

Views are there to aggregate several view/element `actions` into fewer, meaning several buttons can result in one type of `action`. On the other hand this means that the `actions` needs to be resent if they are to reach a parent of the view, since regular views do not have any way of updating the model.

#### Maps

Maps are pure functions that are used to change model data into something else. Avoid using maps if possible. Since the model given to the view is meant for that view most of the time it should hold the correct data already. The usage for maps are to mold data going to a sub view, most likely a component, or to handle things that can be cumbersome to handle in the model, such as a language setting.

## Creating an application

### `application``

```typescript
application<T>(viewName: string,
               initialValue: T,
               views: Views,
               states?: StateConfig[],
               mediumExtenders?: MediumExtenders,
               middlewares?: Array<Middleware | Middlewares>
```

#### viewName

`viewName` is the name of the view that should be used as the root view for the application. If an element with this name exists in the HTML it will be replaced by the view. If there's more than one the first will be replaced. This view must be a [NodeView](#node-view).

#### initialValue

The model value the application root [node](#node) will start with.

#### views

```typescript
{
  views: Array<View<ViewTemplate>>;
  maps?: ViewMap[];
}
```

A list of [views](views) and [maps](#maps) used by the application. `View<ViewTemplate>` is the result of calling `view` or `node-view`.

#### states

A state config can be added to use a [router](#state-router) in the application.

#### mediumExtenders

```typescript
{
  extenders?: Extender[];
  components?: Array<View<ComponentTemplate>>;
}
```

[Extenders](#extenders) and [Components](#components) used by the application.

#### middlewares

Any [middleware](#middleware) to be used on the root node of the component.

### Views

> **Note:** At the moment the result of the `view` function must be manually added to the `views` sent in to `application`.

```typescript
export function view(name: string,
                     template: string): View<ViewTemplate>;
export function view(name: string,
                     template: string,
                     actionMap: ActionMap): View<ActionViewTemplate>;)
```

A view is created through the `view` function, the result is a template that the application can use to render dynamic HTML.

#### `name`

The name of the element that will be replaced by the view.

#### `template`

> **Note:** At the moment a string must be used for the template, no separate files can be used for the template.
>
> **Note:** tag and property names are case insensitive, using lowercase is recommended.
>
> **Note:** Although the view template is HTML-like it will be converted into view objects and then rendered into HTML. This means that the rendered HTML might not look exactly the same as that entered in the template.

The view template is a HTML snippet describing the content of the view containing templates and other views. Templates are used to get model data into the view template. They can be used in text or in property values.

##### Model value

If a model value should be included in the template surround the value with `{{` and `}}`. This will use the model available for the view. So `{{model.property}}` will output that property on the model as a string. A shorthand can be used to access the properties directly `{{property}}` will also select that property on the model. To use the model directly, `{{model}}` can be used.

##### Using views

All registered views can be used inside other views by using an element with the view name.

```html
<view-element></view-element>
```

Elements [added](#inserted-content) to the view will belong to the parent view. This means that any views or templates inserted inside a view element will be using the model of the parent view.

###### Setting the model

The child model on a view must be set when used in another view. It is set by adding a property, `e-select` defining a property on the model of the current view.

##### Styling views

Views for an application should be viewed as one and the entire application should be styled as one. Therefore there are no stylesheets bound to views.

#### `actionMap`

> **Note:** The view uses Action and not events, but they can be viewed as essentially the same thing and the events that are used in the view should be in a direct response to a user action. If there is a need to react to other types of native events consider creating a [component](#components).

An action map is used to transform `ViewActions` to `Actions`. A `ViewAction` is basically a regular action wrapped in context information.

```typescript
export type ActionMap = (
  model: any,
  viewAction: ViewAction
) => Action | undefined;
```

An action is registered by using [e-on](#e-on), add a property on the element for the event that should be listened for. The name is case insensitive.

```typescript
<button e-on-click="example">example</button>
```

A click on the button will result in a `ViewAction` being sent to the action map, in this case:

```typescript
{
  action: ClickEvent;
  target: 'example';
}
```

The ActionMap can then transform that into an Action in response. If it shouldn't result in an action return `undefined`. The returned action can then be listened for on a view containing the view mapping the action.

### Maps

> **Note:** At the moment the result of the `map` function must be manually added to the `views` sent in to `application`.

```typescript
map(name: string, map: ValueMap): ViewMap
```

Maps are functions used in view templates to transform model data to display in the view. It takes one or more arguments, the additional arguments are used from the view template, so they cannot be of `object` type.

#### Using maps

A map can be applied by using `=>` when using a model value. The current value from the model will be sent as the first parameter to the map, if the map requires additional parameters they are separated by a colon. Maps can be used in series, the return value from the preceding map will then be used as the first parameter to the following map. String parameters must use `""` or `''`.

```html
<span>{{property => map1:"param" => map2:true}</span>
```

#### Inserted content

When being used in another view, content can be added to the view element. That content will be added inside the slot. If no slot is present no content can be added to the view.

##### View template - example view

```html
<div class="content">
  <e-slot></e-slot>
</div>
```

##### View template - containing view

```html
<example>
  <div>text</div>
</example>
```

##### Rendered HTML

```html
<example>
  <div class="content">
    <div>text</div>
  </div>
</example>
```

#### Custom properties

There are a few custom properties available to help handling the data. If the value in the property should be based on a model value surround the entire value with `{{` and `}}`.

##### e-select

> **Note:** This value must be a string of the format `child.grandchild.value`.

Will change the property of `model` for a view or set the model that the node views node connects to.

##### e-on

Is used to listen to actions (or HTML events) on views. It is used by prefixing the action name with `e-on-`. This results in a `ViewAction` being sent to the [actionMap](#action-map) for the view.

##### e-if

Hides and shows the element based on the value. If the property is `truthy` the element will exist in the HTML, otherwise it will not.

##### e-for

> **Note:** Only arrays at this point, not any `Iterable`.
>
> **Note:** At the moment no tracking on en element id is possible.

Iterates over an array and creates an `element` for each value using the corresponding array-element as `model` for the element. The elements will be given the model that corresponds to its position in the array. Actions originating from a list, by using [e-on](#e-on), the `ViewAction` will be decorated with an index property.

#### Elements

Custom elements available by default in the view template.

##### e-slot

This element controls where elements added to a child view inside a view template will render inside that [view](#inserted-content).

### Node view

```typescript
nodeView<T>(name: string, template: string, reducer: Reducer<T>, actionMap: ActionMap)
```

A node view is similar to an ordinary view except that they work with a [child node](#creating-a-child-node). The `Actions` returned from the `actionMap` will be registered to the reducer and result in updates to the model. The child node is created when the view is created and will spawn from the closest node above. This means that if a node view resides inside another node view, the child will be created from that views node.

Node views are added to the application in the same place as regular views.

#### Setting the model

> **Note:** Using [translators](#translator) is not yet supported.

The child model on a node view is set in the same way as on a regular view by adding the `e-select` property on the element.

### Components

> **Note:** Components are very simple at the moment.
>
> **Note:** Components lack life-cycle events at the moment.

A Component is a way to to add functionality needed by the view, but that's not supported by HTML. They are a shorthand for using WebComponents.

```typescript
component(name: string,
          template: string,
          actionMap: ActionMap,
          reducer: Reducer<any>,
          initiate: InitiateComponent): View<ComponentTemplate>
```

#### `name``

The name of the component, the element that will be replaced in a view.

#### `template`

A component uses the same template as a [view](#view-template), with the difference being that a components view template will get properties instead of a model.

#### `actionMap``

#### `reducer`

#### `initiate`

This function is used to create the component, i.e. creating streams for native events or elements and giving access to an update function.

```typescript
(element: HTMLElement, node: Node<any>) => ComponentCallbacks;
```

##### `element`

The HTML Element of the component.

##### `node`

The node created for the component

##### `ComponentCallbacks`

```typescript
{
  onBeforeDestroy?: () => void;
}
```

###### `onBeforeDestroy`

The `onBeforeDestroy` function will be called before the component is destroyed, it will be called before the renderer removes the native element representing the component.

#### Styling components

> **Note:** This might change in the future, giving components their own style sheets.

Components does not have any style sheets bound to them, they are short hand and therefore bound to this application and should be styled the same way as views.

### Extenders

> **Note:** Components are very simple at the moment.
>
> **Note:** At the moment only one extender per attribute can be added.

Extenders are used to add functionality to an existing HTML element.

```typescript
extender(name: string, initiateExtender: InitiateExtender): ExtenderDescriptor
```

Name is the name of the attribute that will apply the extender to an element.

#### `initiateExtender`

This function is used to initiate the extender, it will be given the native element it's applied on.

```typescript
(element: Element) => ExtenderCallbacks;
```

##### `ExtenderCallbacks`

```typescript
{
  onUpdate: OnPropertyUpdate;
  onBeforeDestroy?: () => void;
}
```

###### `onUpdate`

```typescript
(newValue: NullableValue, oldValue: NullableValue | undefined, properties: Dict<NullableValue>) => void;
```

Update will be called every time the value changed. The properties are view properties and are not just the strings that are shown in the element attributes. The first time update is called `oldValue` will be `undefined`.

###### `onBeforeDestroy`

The onBeforeDestroy function will be called when the element that the extender was applied to is about to be removed from the DOM and destroyed, the extender will not be called again and should do all preparations needed for garbage collection.

## State router

The state router is a way to define a number of states for the model. The router handles transitions between states and retrieves data needed to update the model for a new state and define rules for moving between states. The state router uses actions to move between different states. These actions can be used to update the model to hold all the data needed.

### Defining states

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

An optional object containing one or more functions for returning data. The function will be called with the current model and the current router state and should return an observable for the data. This will result in an object containing the values of the observables on the [Transitioned Action](#transitioned-action).

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

An optional function returning an observable of a boolean or a [prevent](#prevent). If a `false` or a prevent is returned the transition will be prevented, and a [Transition Prevented Action](#transition-prevented-action) will be sent.

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

The added properties will be added to the TransitionPrevented action returned.

#### `children`

A state can have sub states that relies on the parent state. Child states work the same as other states except that the parent state will load first. So when moving to a child state all parent states will load first. When moving between siblings the parent state will not be loaded again.

This means that there will be a [Transitioned Action](#transitioned-action) for each parent state entered before the one for the state being routed to. This is to give the possibility to set the model in the state it needs to be to enter the child state.

If a parent state prevents leaving the router state will remain at the child state the transition originated from.

> **Note:** If any parent state prevents entering, or leaving, this will stop the transition. So that the transition might not reach the target state even though that state allows entering.

### State

Describes a state. Used by the router during transitions. Also sent with the router actions so appropriate handling can be done to the model during or after a transition.

```typescript
{
  name: string;
  params: StateParams;
}
```

#### StateParams

An object containing additional parameters for the [state](#state) being routed to.

### Actions

There are a number of actions used during a transition to another state.

#### `TransitionAction`

This is the action used to initiate a transition to a new state. It should contain the state that it should be routed to.

```typescript
{
  type: 'EinRouterTransition';
  to: State;
}
```

#### `TransitioningAction`

This action will be sent after canLeave and canEnter has been checked and the data has started to load. The from state will not be there for the initial route to the first state.

```typescript
{
  type: 'EinRouterTransitioning';
  to: State;
  from?: State;
}
```

#### `TransitionedAction`

This action marks the completion of the routing. The data object will be populated by data if the `StateConfig` has defined it. The property will have the same name as when defined.

```typescript
{
  type: 'EinRouterTransitioned';
  to: State;
  from?: State;
  data: object;
}
```

#### `TransitionPreventedAction`

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

#### `TransitionFailedAction`

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

### Browser views

There are two views that can be added with the router. They should only be considered as such and not part of the router. They show a representation of the current model value and allow for user interaction.

#### Url

If a `path` property is added to the StateConfig the url will change based on this path. The url should only be viewed as a representation of the model state and to simplify linking into the application.

The url will update based on the current model state. Back and forward button interaction will result in transition actions being sent. It will also translate the url on initial load to a transition action.

##### `path`

The path is a string built up by segments. A segment consists of a `/` followed by a string. If the string is prefixed by `:` that segment will become a variable and will be read from the StateParams. E.g. if `/:id` is added, it will be read as the property `id`. It will also be added to the StateParams for the action created on initial load. If there are parameters in the StateParams that doesn't exist in the path they will be added as query parameters to the url. A variable can be turned optional by suffixing `?` to the variable segment. Optional variables can only be followed by other optional variables.

```typescript
path: '/example/:variable/:optional?';
```

##### Children

The path of children will be appended to the path of the parent state. So the url for a child state will be `https://example.com/parent/child`.

#### Title

If a `title` property is added on the StateConfig the document title will be updated when the transition is completed states.

```typescript
title: string | (s: State) => string;
```

The title property can be a string or a function that returns a string based on the current State.

### Extenders

There are two [extenders](#extenders) defined to help using the router in HTML. They rely on `path` being defined for the states.

#### Link `e-link`

Expects a string that is equal to a `path` for a state. Clicking the element will send a [Transition Action](#transition-action).

If added on an `<a>`-element the extender will create a href-attribute that will link to the state and can be opened in a new window.

#### Link active `e-link-active`

Must be used in conjunction with `e-link`. Expects a string formatted in the same way as the `class` attribute. The classes will be applied to the element when the state that is defined in `e-link` is active.

## Nodes

> **Note:** Most of this is done by `Application` when using a view on the node.

A node is comparable to both the controller and the model of a typical MVC. It is responsible to inform of the current model value and also to broker updates. Handling charges to the model value is the responsibility of the implementation of the [reducer](#reducer) responding to [actions](#actions). The actual updating of data is done by the parent node giving it the option of reacting to, or modifying the data. The update will be passed up through each parent until it reaches the root node, that will then send the updated model.

### Creating a root node

> **Note:** When creating an [application](#application) this is created automatically.

To create the root node use the `create` function. Supply an initial value for the model and an [reducer](#reducer). The type argument is the model interface. Optional [mixins](#mixins) and [middleware](#middleware) can also be added.

```typescript
create<T>({example:'Hello World'},
          reducer: Reducer<T>,
          [ExampleMixin],
          [exampleMiddleware]): Node<T>
  const node: Node<Example> = create(exampleMap, {example:'Hello World'});
```

### Getting the model value

A node will send an update after an action has mapped the model to a new in with the reducer. Subscribe to the node to get model updates, it is possible to have multiple subscriptions to the same node.

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

An action describes an update to the model. It is used by the reducer to create a new model value, so they should carry all the information needed to update the model. The actions only require a `type` property of string type and can have any other properties.

Actions are mapped by calling next on a node.

```typescript
const action: ExampleAction = node.next({
  type: 'EXAMPLE',
  value: 'hello world'
});
```

Next will return the mapped action, or something from a [middleware](#middleware).

### Child node

Parts of the model can picked out and a node can be created for that specific part of the model. This can be useful to let views be oblivious about the application as a whole and only see the part of the model it handles. There is no limit on how many children that can be created on a model property.

The Actions mapped in a child will be sent as an `Update` to the parent node, so that the parent can [react](#trigger) to a change in the child. The update will only be sent to the node that spawned the child, not to all nodes handling that part of the model. The `Update` will however be sent all the way up to the root node, passing all parents up the hierarchy chain.

```typescript
interface Update<T> {
  action?: Action;
  childUpdate?: Update<any>;
  model: T;
}
```

When the update reaches the root node its model, the full model, will be updated resulting in updates to all the models that has been affected by the change.

#### Creating a child node

Create a child by specifying a reducer and which property of the model that will be watched. A child could be created deeper in the model by dot-notation `child.grandChild`.

```typescript
const child: Node<ExampleChild> = node.createChild(reducer, 'child');
const child: Node<ExampleChild> = node.createChild(reducer, trigger, 'child');
```

Alternatively a [translator](#translator) can be specified to get the part of the model that's needed, or to create an aggregate model.

```typescript
const child: Node<ExampleChild> = node.createChild(reducer, childTranslator);
const child: Node<ExampleChild> = node.createChild(
  reducer,
  trigger,
  childTranslator
);
```

If the model being watched is removed or if the translator returns `undefined` the child node will be completed. After it has been completed a new one will have to be created to watch that part of the model again. This also means that if the model is `undefined` when creating the child it will immediately be completed and unsubscribe from its parent.

#### Disposing

When a child no longer is needed it should be removed by calling `dispose` on the node. This will complete the nodes streams and updates will no longer change the node.

### Translator

A translator should be able to get a model property and to be able to return that to the model. The translator can be used to create computed values, consisting of multiple properties or a derivative of properties, from the model and serve to a child.

#### `get:(m: T) => U | undefined`

The get function of the translator gets the value from the model. If it can't, return `undefined`.

#### `give:(m: T, mm: U) => T`

The give function sets the value back on the model.

### Reducer

```typescript
(model: T, action: Action) => T;
```

The reducer is responsible to create a new model value in response to an [action](#actions). It should be a pure function that takes a model and an action and returns a new model, or the same object if nothing was changed by the action. Only return a new object if the action actually produced a result.

> **Note:** Since a new object is returned make sure use an id property on the objects to identify them.

```typescript
reducer(model: Example, action: ExampleAction): Example {
  if (action.type === EXAMPLE_TYPE) {
    return {...model, {example: 'example'});
  }
  return model;
}
```

### Trigger

```typescript
(model: T, action: Action) => Action | undefined;
```

A trigger gives a parent node a chance to react to a change of a child. It's responsible for creating actions based on the action mapped in a child node or any node lower in that chain. Having a trigger is optional.

After an action has been mapped in a [child](#creating-a-child-node) an `Update` is created that will bubble upp the hierarchy up to the root node. That `Update` is sent to the trigger for the parent. Actions created by a trigger are mapped directly and as a part of the current update.

> **Note:** Avoid changing the data that the child has created, since a child is typically created to be the manager of that data. And it should be the only one making changes to it.

A trigger is given the a model, in its new state, and the childs `Update` and should return an action. Should return `undefined` for no result.

```typescript
trigger(model: Example, update:Update<ChildExample>): ExampleAction | undefined {
  if (action.type === EXAMPLE_TYPE) {
    return {type: 'TRIGGERED_FOR_EXAMPLE'}
  }

  return undefined;
}
```

### Middleware

A middleware can be added to the process of executing an action. They can be useful for data retrieving or tracing. Middleware functions are called by the previous one. The first gets the action supplied to [next](#actions) and the last middleware will supply the action to the [reducer](#reducer). Any middleware can cancel the action by not calling the following function.

#### Adding

[Create](#creating-the-root-node) or [Application](#application) both take an array of `Middleware` or `Middlewares`. `Middlewares` is a container for two different middleware one for the normal execution and one for the actions created by the trigger map for a node.

#### Creating

A middleware should be a pure function. There are two types of middleware, one is applied to the regular process of executing an action ([next](#next)), which includes executing of the action and any actions created by the trigger map. The other type is applied to the execution of a triggered action ([for-trigger](#for-trigger)) and it's limited in what it can do.

```typescript
(next: (action: Action) => Action, getValue: () => Value) => (
  following: (action: Action) => Action
) => (action: Action) => Action;
```

The following function is creating a middleware that will log out some info about the execution.

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

This might look a little daunting, but let's break it down.

##### `next`, `value`

```typescript
function middleware(next, value) {
  ...
}
```

The first function is there to give access to `next` and `value` on the node. It returns a function that will be given the next function in the execution chain. This might be another middleware or the function executing the action and updating the model.

##### `following`

```typescript
return (following) => {
  ...
}
```

##### `action`

This function is responsible for creating the middleware function that will be applied on the execution chain.

```typescript
return (action) => {
  log('initial:', value();
  log('action: ', action.type);
  const result = following(action);
  log('new:', value();
  return result;
}
```

This is the middleware function that will be called during [next](#actions). The functions supplied in earlier functions are available to this function. They are `value`, that returns the current model value, and `next`, that allows another action to be sent for execution. Make sure to only use `value` and `next` from within the middleware. An action can be canceled by not calling `following`.

##### Update middleware

This middleware is similar, but works on the model making its way up the node hierarchy chain. Typically this is seldom needed to supply.

The value supplied is an Update containing the transient model that is making its way up the chain and might be changed in higher up in the chain. It might also contain a triggered a

```typescript
(next: (action: Action) => Action, getValue: () => Value) => (
  following: (update: Update<T>) => Update<T>) => (action: Update<T>) => Update<T>;
```

```typescript
function middleware(next, value) {
  return (following) => {
    return (update) => {
      log('initial:', value();
      log('update: ', update);
      following(action);
      log('new:', update.model;
    }
  }
}
```

If an update middleware is implemented it needs to supplied with a middlewares.

```typescript
{
  next: myMiddleware;
  update: myUpdateMiddleWare;
}
```

### Mixins

Mixins are used to change, or add to, the functionality of the nodes. Typically these won't be used, but are used internally in Ein.

#### Adding

Since mixins will alter what is returned from create a type or interface is needed for the return value from create.

```typescript
export type MyNode = MixinInterface1 & MixinInterface2;
```

#### Problems

Type inference isn't working properly when using mixins the types must be explicitly stated or the result cast to the correct type.

```typescript
const node: MyNode<Example> = <Example, MyNode<Example>> create...
```

```typescript
const node: MyNode<Example> = create... as MyNode<Example>
```

Unfortunately at the moment the type returned from [`createChild`](#creating-a-child-node) isn't correct if mixins are used the result must be explicitly cast.

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
  };
}
```
