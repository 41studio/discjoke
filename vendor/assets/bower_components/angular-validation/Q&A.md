Q & A
=====
###Can I validate the form when init ? [#10](https://github.com/huei90/angular-validation/issues/10)###

```html
<form name="Form">
    <input type="text" name="number" ng-model="form.number" validator="number"/>
    <button id="button1111" ng-click="form.submit(Form)">Show</button>
</form>
```
```javascript
$timeout(function () { // call $timeout to make sure the Form Constructor is generated
    $validationProvider.validate($scope.Form); // $scope.Form is html form name `Form Constructor`
});
```

###What's the differentiate between validator-method `submit` and `submit-only`[#4](https://github.com/huei90/angular-validation/issues/4)###

`submit` : when user click submit, then start watching using `watch` to validate<br/>
`submit-only` : when user click `submit`, doesn't validate through `watch` until `submit` button is clicked.

###Use checkValid() manually [#19](https://github.com/huei90/angular-validation/issues/19)###

Before using `checkValid()`, you have to execute `submit` first to get the latest result.

###How do we do tooltips for error messages upon focusing? [#68](https://github.com/huei90/angular-validation/issues/68#issuecomment-86445467)

Using `validCallback` and `invalidCallback` to implement
