from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import *


# Create your views here.
@api_view(['GET'])
def apiView(request):
    api_urls = {
        'List': '/task/',
        'Detail': '/task-detail/<str:pk>/',
        "Create": '/tast-create/',
        "Update": '/tast-update/<str:pk>',
        "Delete": '/tast-delete/<str:pk>'
    }
    return Response(api_urls)


@api_view(['GET'])
def taskList(request):
    task = Task.objects.all().order_by('-id')
    serializer = TaskSerializer(task, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def taskDetail(request, pk):
    task = Task.objects.get(id=pk)
    serializer = TaskSerializer(task, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def taskCreate(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['POST'])
def taskUpdate(request, pk):
    task = Task.objects.get(id=pk)
    serializer = TaskSerializer(instance=task, data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['DELETE'])
def taskDelete(request, pk):
    task = Task.objects.get(id=pk)
    task.delete()
    return Response("Deleted")
