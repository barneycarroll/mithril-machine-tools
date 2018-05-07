# Off

## What?

Off consumes attributes with the keys matching event types mapping to handlers. It will then add (and remove) listeners such that the handlers trigger when the corresponding events trigger on elements that aren't within the subtree. It performs this during the capture phase such that it can intercept events before they trigger handlers bound to other components' local DOM.

## Why?

Some UI components trigger a special global UI state that overrides devolved concerns: an urgent interstitial notice demanding explicit user acknowledgment might want to wrest control of user input, preventing user journey deviations such as continuing to input into forms, navigation etc elsewhere on the page.

In other circumstances, you may wish to respond to user inputs that would otherwise be intercepted by their containing components and stop bubbling when handled. For instance, a passive interstitial notice may wish to disappear after any user input, but risk not capturing that input if it fails to bubble to the top of the document.

## How?

***

## But

Some events, notably `focus` & `blur` cannot be prevented: the event listener interface merely represents a signal that the corresponding action has already taken place.
