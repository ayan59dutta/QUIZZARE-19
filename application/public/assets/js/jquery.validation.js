(function($){"use strict";var validate_state=!0;$.fn.validate=function(options){var settings={dir:'down',fieldContainer:$(this),tableName:'',methodName:'',checkDuplicateRecUrl:'',validationState:!1,submitType:'submit',callback:function(){},validaterules:function(rule_type,element){var rules={alphanum:{check:function(element){if(element.val())
return settings.testPattern(element.val(),/^[a-zA-Z0-9\s\r\n@#%$&,"'?<=>!+()*:&;//\\._-]+$/i);return!0},msg:"must be letters and numbers"},alpha:{check:function(element){if(element.val())
return settings.testPattern(element.val(),/^[a-zA-Z ._-]+$/i);return!0},msg:"should only contain letters"},digit:{check:function(element){if(element.val())
return settings.testPattern(element.val(),/^[-+]?[0-9]+$/);return!0},msg:"should only contain integer"},number:{check:function(element){if(element.val())
return settings.testPattern(element.val(),/^[-+]?[0-9.]+$/);return!0},msg:"should only contain numbers"},date:{check:function(element){if(element.val())
return settings.testPattern(element.val(),/^[0-9-]*$/);return!0},msg:"must be a valid date"},time:{check:function(element){if(element.val())
return settings.testPattern(element.val(),/^[0-9:APM]*$/);return!0},msg:"must be a valid time"},url:{check:function(element){if(element.val())
return settings.testPattern(element.val(),/(http(s)?:\\)?([\w-]+\.)+[\w-]+[.com|.in|.org]+(\[\?%&=]*)?/);return!0},msg:"must be a valid url"},email:{check:function(element){if(element.val())
return settings.testPattern(element.val(),/^[a-z0-9._%-^,\s]+@[a-z0-9-.^,\s]+\.[a-z^,\s]{2,4}$/i);return!0},msg:"must be a valid email address"},phone:{check:function(element){if(element.val())
return settings.testPattern(element.val(),/^[+0-9-^,\s]+$/);return!0},msg:"must be a valid phone number"},field_name:{check:function(element){if(element.val())
return settings.testPattern(element.val(),/^[a-z_.0-9]*$/);return!0},msg:"should be in lowercase without space"},min_length:{check:function(element){if(element.val()){if(element.val().length<element.attr('minlength'))
return!1;else return!0}
return!0},msg:"min_length"},check_duplicate:{check:function(element){if(element.val()){var state=!1;if(element.attr('table')!==undefined)
var table=element.attr('table');else var table=settings.tableName;var condition="";var condition_field="";if(element.attr('condition')!==undefined)
{var condition_element_field=new Array();condition_element_field=element.attr('condition').split('=');if($('[name='+condition_element_field[1]+']').length>0)
condition=$('[name='+condition_element_field[1]+']').val();else condition=$('#'+condition_element_field[1]).val();condition_field=condition_element_field[0]}
$.ajax({async:!1,type:"POST",url:settings.checkDuplicateRecUrl,data:'table='+table+'&field='+element.attr('name')+'&data='+element.val()+'&id='+$('[name=id]').val()+'&method='+settings.methodName+'&condition_field='+condition_field+'&condition_value='+condition+'&csrfToken='+$('[name=csrfToken]').val(),success:function(msg){if(msg==0)
state=!0;else state=!1}});return state}
return!0},msg:"check_duplicate"},match:{check:function(element){if(element.val()){if(element.val()==$(element.attr('match')).val())
return!0;else return!1}
return!0},msg:"not matched"},mime_type:{check:function(element){if(element.attr('file-name')){var extension=element.attr('file-name').substr(element.attr('file-name').lastIndexOf('.')+1).toLowerCase();if(element.attr('data-mime-type')!==undefined&&element.attr('data-mime-type').indexOf(extension)===-1)
return!1;else return!0}
return!0},msg:"not supported"},file_size:{check:function(element){if(element.attr('file-size')){if(Number(element.attr('file-size'))>(1024*1024)*5)
return!1;else return!0}
return!0},msg:"file size exceeded"},required:{check:function(element){if(element.is('input:checkbox')||element.is('input:radio'))
{var selector=$('[name="'+element.attr('name')+'"]:checked');if(selector.length>0)
return!0;else return!1}
else{if(element.val().length>0||(element.attr('type')=='file'&&!empty(element.attr('data-file-name'))))
return!0;else return!1}},msg:"is required"}}
var valid=new Array();valid[0]=rules[rule_type].check(element);valid[1]=rules[rule_type].msg;return valid},testPattern:function(value,pattern){var regExp=pattern
return regExp.test(value)},validationList:function(elem){var validationList=elem.attr('validation').split(/\s+/);var validations=new Array(validationList.length);$.each(validationList,function(index,item){validations[index]=item});return validations},checkField:function(event,field){if(field.attr('placeholder')!==undefined&&field.attr('placeholder')!='')
var field_title=field.attr('placeholder');else var field_title='This field';validations=settings.validationList(field);for(var i=0;i<=validations.length-1;i++)
{if(!(event=='keyup'&&validations[i]=='check_duplicate'))
{result=settings.validaterules(validations[i],field);message=result[1];if(result[0])
{settings.RemoveError(field)}
else{if(message=='min_length')
settings.ShowError(field,field_title+" should contain min "+field.attr('minlength')+" characters");else if(message=='check_duplicate')
settings.ShowError(field,field_title+" '"+field.val()+"' already exists");else{if(field.is('input:checkbox'))
settings.ShowError(field,'Please choose at least one option');else if(field.is('input:radio'))
settings.ShowError(field,'Please choose one option');else if(field.is('select'))
settings.ShowError(field,'Please select a value from list');else if(field.is('input:file'))
{if(message=='not supported')
settings.ShowError(field,'Please select a valid file type ('+field.attr('data-mime-type')+')');else settings.ShowError(field,'File size exceeded. Please select a file upto 5MB')}
else settings.ShowError(field,field_title+' '+message)}
validate_state=!1;break}}}
return validate_state},validate_fields:function(event,field){validate_state=!0;if(event=='submit'||event=='ajax')
{settings.fieldContainer.find('*[validation]:not(:disabled):not([validation=""]):not([validate=false])').each(function(){submit_state=settings.checkField(event,$(this));return submit_state});if(!submit_state)
{$('html, body').animate({scrollTop:settings.fieldContainer.find('*[validation].field-error').first().offset().top-95},500,function(){settings.fieldContainer.find('*[validation].field-error').first().focus()})}
settings.callback(submit_state)}
else submit_state=settings.checkField(event,field);return submit_state},ShowError:function(field,msg){field.addClass('field-error');field.closest("div[class^='col-sm-']").find('ul.parsley-errors-list').remove();field.closest("div[class^='col-sm-']").append('<ul class="parsley-errors-list filled"><li class="parsley-required">'+msg+'</li></ul>')},RemoveError:function(field){field.removeClass('field-error');field.closest("div[class^='col-sm-']").find('ul.parsley-errors-list').remove()},addValidation:function(field,$validation){field.attr('validation',$validation)},removeValidation:function(field){field.removeAttr('validation')}}
if(options){$.extend(settings,options)}
var ofstLeft=0;var ofstTop=0;var field,validations,result,validate_state=!0,submit_state=!0,message='';var container,field_title;var validation_state;settings.fieldContainer.submit(function(e){e.stopPropagation();var disabled=$(this).attr('disabled');if(!(typeof disabled!==typeof undefined&&disabled!==!1)){if(settings.submitType=='submit')
return settings.validate_fields('submit',!1);else if(settings.submitType=='ajax')
{e.preventDefault();settings.validate_fields('ajax',!1)}}else{e.preventDefault()}});$(document).on('keyup','input[validation]:not(:disabled):not([validation=""]):not([validate=false]), textarea[validation]:not(:disabled):not([validation=""]):not([validate=false])',function(e){if(!(e.which>36&&e.which<41)){settings.validate_fields('keyup',$(this))}});$(document).on('change','input[validation]:not(:disabled):not([validation=""]):not([validate=false]), select[validation]:not(:disabled):not([validation=""]):not([validate=false])',function(e){if(!(e.which>36&&e.which<41)){settings.validate_fields('change',$(this))}});return settings}}(jQuery))