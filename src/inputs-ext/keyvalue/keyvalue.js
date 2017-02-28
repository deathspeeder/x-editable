/**
Editable input for key value pairs.
Internally value stored as {key1:"value1", key2:"value2"}

@class keyvalue
@extends abstractinput
@final
@example
<a href="#" id="keyvalue" data-type="keyvalue" data-pk="1">key1=value1 key2=value2</a>
<script>
$(function(){
    $('#address').editable({
        url: '/post',
        title: 'Enter key value pairs',
        value: {
            key1: "value1",
            key2: "value2"
        }
    });
});
</script>
**/
(function ($) {
    "use strict";
    
    var KeyValue = function (options) {
        this.init('keyvalue', options, KeyValue.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(KeyValue, $.fn.editabletypes.abstractinput);

    $.extend(KeyValue.prototype, {
        /**
        Renders input from tpl

        @method render() 
        **/        
        render: function() {
           this.$table = this.$tpl.find('table');
           $('.add-edit-line').click(keyvalueAddLine);
        },
        
        /**
        Default method to show value in element. Can be overwritten by display option.
        
        @method value2html(value, element) 
        **/
        value2html: function(value, element) {
            if(!value) {
                $(element).empty();
                return; 
            }
            var tokens = []
            for (var k in value) {
                tokens.push(k + '=' + value[k])
            }
            $(element).html(tokens.join(" "));
        },
        
        /**
        Gets value from element's html
        
        @method html2value(html) 
        **/        
        html2value: function(html) {
           var result = {};
          if (html) {
            var tokens = html.split(" ");
            for (var i=0; i<tokens.length; i++) {
                var kv = tokens[i].split("=");
                result[kv[0]]=kv[1];
            }
          }
          return result;
        },
      
       /**
        Converts value to string. 
        It is used in internal comparing (not for sending to server).
        
        @method value2str(value)  
       **/
       value2str: function(value) {
           var str = '';
           if(value) {
               for(var k in value) {
                   str = str + k + ':' + value[k] + ';';  
               }
           }
           return str;
       }, 
       
       /*
        Converts string to value. Used for reading value from 'data-value' attribute.
        
        @method str2value(str)  
       */
       str2value: function(str) {
           /*
           this is mainly for parsing value defined in data-value attribute. 
           If you will always set value by javascript, no need to overwrite it
           */
           return str;
       },                
       
       /**
        Sets value of input.
        
        @method value2input(value) 
        @param {mixed} value
       **/         
       value2input: function(value) {
           if(!value) {
             return;
           }
           for (var k in value) {
               var inputKey = '<td><input type="text" class="input-small" value="' + k + '"></td>';
               var inputValue = '<td><input type="text" class="input-small" value="' + value[k] + '"></td>';
               var deleteButton = '<td><a href="#" class="delete-edit-line">&times;</a></td>'
               var line = $('<tr>').append(inputKey).append(inputValue).append(deleteButton);
               this.$table.find('tbody').append(line);
               $('.delete-edit-line').click(function() {
                   $(this).parent().parent().remove();
               });
           }
       },       
       
       /**
        Returns value of input.
        
        @method input2value() 
       **/          
       input2value: function() {
           var result = {};
           this.$table.find('tbody tr').each(function() {
               var k = $($(this).find('td input')[0]).val();
               var v = $($(this).find('td input')[1]).val();
               if (/^[a-zA-Z0-9-._]+$/.test(k)) {
                  result[k] = v;
               }
           });
           return result;
       },        
       
        /**
        Activates input: sets focus on the first field.
        
        @method activate() 
       **/        
       activate: function() {
        this.$table.find('tbody tr td input').focus();
       },  
       
       /**
        Attaches handler to submit form in case of 'showbuttons=false' mode
        
        @method autosubmit() 
       **/       
       autosubmit: function() {
           this.$input.keydown(function (e) {
                if (e.which === 13) {
                    $(this).closest('form').submit();
                }
           });
       }       
    });

    KeyValue.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        tpl: '<div style="overflow-y: auto; max-height:400px;">' +
             '<table class="table table-bordered">' +
                '<thead><tr><td>Key</td><td>Value</td><td></td></tr></thead>' +
                '<tbody></tbody>' +
             '</table>' +
             '<a href="#" class="add-edit-line">+ Add a new line' +
             '</div>',
        inputclass: ''
    });

    $.fn.editabletypes.keyvalue = KeyValue;

}(window.jQuery));


function keyvalueAddLine() {
    var inputKey = '<td><input type="text" class="input-small" value=""></td>';
    var inputValue = '<td><input type="text" class="input-small" value=""></td>';
    var deleteButton = '<td><a href="#" class="delete-edit-line">&times;</a></td>'
    var line = $('<tr>').append(inputKey).append(inputValue).append(deleteButton);
    $(this).parent().find("table tbody").append(line);
    line.find('input:first-child').focus();
    $('.delete-edit-line').click(function() {
        $(this).parent().parent().remove();
    });
}
