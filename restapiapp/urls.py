from django.urls import path
from .views import *

urlpatterns = [
    path('', apiView, name='apiurls'),
    path('task/', taskList, name='task'),
    path('task/<int:pk>', taskDetail, name='task-detail'),
    path('taskcreate/', taskCreate, name='task-create'),
    path('taskupdate/<int:pk>', taskUpdate, name='task-update'),
    path('taskdelete/<int:pk>', taskDelete, name='task-delete'),
]