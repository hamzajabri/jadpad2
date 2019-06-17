const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
$.fn.extend({
  animateCss: function(animationName, callback) {
    var animationEnd =
      'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);
      if (callback) {
        callback();
      }
    });
    return this;
  }
});


//Form validation
(function() {
  var constraints1 = {
    email: {
      // Email is required
      presence: true,
      // and must be an email (duh)
      email: {
        message: '^Please enter a valid email'
      }
    }
  };
  var constraints2 = {
    firstName: {
      presence: true
    },
    lastName: {
      presence: true
    },
  };

  var form1 = document.querySelector('#step1');
  $('#email').keypress(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      if (handleFormSubmit(form1, constraints1)) {
        $('#step1').hide(400);
        $('#mainTitle').hide(400);
        $('#step2').fadeIn();
        $('#step2Title').fadeIn();
      }
    }
  });

  $('#nextStep').on('click', function(ev) {
    ev.preventDefault();
    if (handleFormSubmit(form1, constraints1)) {
      $('#step1').hide(400);
      $('#mainTitle').hide(400);
      $('#step2').fadeIn();
      $('#step2Title').fadeIn();
    }
  });
  // Hook up the form so we can prevent it from being posted
  var form2 = document.querySelector('#step2');
  $('#submit').on('click', function(ev) {
    ev.preventDefault();
    if (!$(this).hasClass('loading')) {
      if (handleFormSubmit(form2, constraints2)) {
        var $form = $('#signup');
        $(this).addClass('loading');
        $.post($form.attr('action'), $form.serialize()).then(function() {
          $('#signUpWrapper').hide(400);
          $('#step2Title').hide(400);
          $('#step3').fadeIn();
        });
      }
    }
  });

  var inputs1 = form1.querySelectorAll('input:not([type="hidden"]), textarea, select');
  for (var i = 0; i < inputs1.length; ++i) {
    inputs1.item(i).addEventListener('change', function(ev) {
      this.setAttribute('value', this.value);
      var errors = validate(form1, constraints1) || {};
      showErrorsForInput(this, errors[this.name]);
    });
  }
  // Hook up the inputs to validate on the fly
  inputs2 = form2.querySelectorAll('input:not([type="hidden"]), textarea, select');
  for (var i = 0; i < inputs2.length; ++i) {
    inputs2.item(i).addEventListener('change', function(ev) {
      this.setAttribute('value', this.value);
      var errors = validate(form2, constraints2) || {};
      showErrorsForInput(this, errors[this.name]);
    });
  }

  function handleFormSubmit(form, constraints) {
    // validate the form aainst the constraints
    var errors = validate(form, constraints);
    // then we update the form to reflect the results
    showErrors(form, errors || {});
    if (!errors) {
      return true;
    }
  }
  // Updates the inputs with the validation errors
  function showErrors(form, errors) {
    // We loop through all the inputs and show the errors for that input
    _.each(form.querySelectorAll('input[name]:not([type="hidden"]), select[name]'), function(input) {
      // Since the errors can be null if no errors were found we need to handle
      // that
      showErrorsForInput(input, errors && errors[input.name]);
    });
  }

  // Shows the errors for a specific input
  function showErrorsForInput(input, errors) {
    // This is the root of the input
    var formGroup = closestParent(input.parentNode, 'form-group'),
      // Find where the error messages will be insert into
      messages = formGroup.querySelector('.error-message');
    // First we remove any old messages and resets the classes
    resetFormGroup(formGroup);
    // If we have errors
    if (errors) {
      // we first mark the group has having errors
      formGroup.classList.add('has-error');
      // then we append all the errors
      _.each(errors, function(error) {
        addError(messages, error);
      });
    } else {
      // otherwise we simply mark it as success
      formGroup.classList.add('has-success');
    }
  }
  // Recusively finds the closest parent that has the specified class
  function closestParent(child, className) {
    if (!child || child == document) {
      return null;
    }
    if (child.classList.contains(className)) {
      return child;
    } else {
      return closestParent(child.parentNode, className);
    }
  }
  function resetFormGroup(formGroup) {
    // Remove the success and error classes
    formGroup.classList.remove('has-error');
    formGroup.classList.remove('has-success');
    // and remove any old messages
    _.each(formGroup.querySelectorAll('.help-block.error'), function(el) {
      el.parentNode.removeChild(el);
    });
  }
  // Adds the specified error with the following markup
  // <p class="help-block error">[message]</p>
  function addError(messages, error) {
    var block = document.createElement('p');
    block.classList.add('help-block');
    block.classList.add('error');
    block.innerText = error;
    messages.appendChild(block);
  }
  function showSuccess() {
    // We made it \:D/
    alert('Success!');
  }
  var $select = $('select').selectize();
  $('.selectize-control.no-search  input').prop('disabled', 'disabled');

  var clipboard = new Clipboard('#copyUrl');
  clipboard.on('success', function(e) {
    $('.copied').fadeIn(200);
    setTimeout(function() {
      $('.copied').fadeOut();
    }, 1000);
    e.clearSelection();
  });

  var isMobile = false; //initiate as false
  if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
      navigator.userAgent
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      navigator.userAgent.substr(0, 4)
    )
  )
    isMobile = true;
  if (isMobile) {
    $('.device-only').css({ display: 'inline-block' });
  }
})();
