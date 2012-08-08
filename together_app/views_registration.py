from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_exempt
from django.contrib import auth

@csrf_exempt
def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            new_user = form.save()
            return HttpResponseRedirect("/project")
    else:
        form = UserCreationForm()
    return render_to_response("registration/register.html", 
                                {'form': form,})

# @csrf_exempt
def login(request):
    return render_to_response('registration/login.html')

# def login(request):
#     if request.method != 'POST':
#         raise Http404('Only POSTs are allowed')
#     try:
#         m = Member.objects.get(username=request.POST['username'])
#         if m.password == request.POST['password']:
#             request.session['member_id'] = m.id
#             return HttpResponseRedirect('/you-are-logged-in/')
#     except Member.DoesNotExist:
#         return HttpResponse("Your username and password didn't match.")

@csrf_exempt
def login_view(request):
    username = request.POST.get('username', '')
    password = request.POST.get('password', '')
    user = auth.authenticate(username=username, password=password)
    if user is not None and user.is_active:
        # Correct password, and the user is marked "active"
        auth.login(request, user)
        # Redirect to a success page.
        return HttpResponseRedirect("/project")
    else:
        # Show an error page
        return render_to_response("registration/login.html")

@csrf_exempt
def logout_view(request):
    auth.logout(request)
    # Redirect to a success page.
    return render_to_response("registration/login.html")