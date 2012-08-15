from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response, redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib import auth
from django.contrib.auth.models import User

@csrf_exempt
def home(request):
    print request.user, request.user.is_authenticated()
    print request.method =='POST'
    if request.user.is_authenticated():
        return HttpResponseRedirect("/project")
    else: 
        if request.method =='POST':
            print 1
            if request.POST.get('form') == 'register':
                print 2
                register(request.POST)
            if request.POST.get('form') == 'login':
                print 3
                errors = login_view(request)
                print 'errors', errors
                if errors:
                    return render_to_response("registration/login.html",{'errors': errors})
                else:
                    return redirect("project_home")
        else:
            render_to_response("registration/login.html")

    return render_to_response("registration/login.html")

def register(form):
    errors = []
    if form['email']=='':
        errors.append('You need to provide an email.')
    if form['username']=='':
        errors.append('You need to provide an username.')
    if form['password1'] == '':
        errors.append('You need to provide a password.')
    if form['password1'] != form['password2']:
        errors.append('The passwords need to be the same.')
    
    if errors != []:
        print 1
        return render_to_response("registration/register.html",{'errors':errors})
    else: 
        user = User()
        user.username = form['username']
        user.email = form['email']
        user.set_password(form['password1'])
        user.save()

        return redirect("project_home")

@csrf_exempt
def login_view(request):
    username = request.POST.get('username', '')
    password = request.POST.get('password', '')
    errors = ''
    user = auth.authenticate(username=username, password=password)
    if user is not None and user.is_active:
        # Correct password, and the user is marked "active"
        auth.login(request, user)
        # Redirect to a success page.
    else:
        errors += "Sorry, we were not able to connect you. Please try again."
    return errors

@csrf_exempt
def logout_view(request):
    auth.logout(request)
    # Redirect to a success page.
    return redirect("home")

