# Serializers are responsible for converting complex data types, like Django model instances, into native Python datatypes that can then be easily rendered into JSON. We will create a ModelSerializer for each model to automate this process.
# api/serializers.py

from rest_framework import serializers
from .models import User, Profile, Problem, Submission, Contest, ContestParticipant, TestCase

# CORRECTED: Use a plain Serializer for the abstract TestCase model
class TestCaseSerializer(serializers.Serializer):
    input_data = serializers.CharField()
    expected_output = serializers.CharField()
    is_hidden = serializers.BooleanField()

    class Meta:
        fields = ['input_data', 'expected_output', 'is_hidden']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Profile
        fields = '__all__'

class ProblemSerializer(serializers.ModelSerializer):
    test_cases = TestCaseSerializer(many=True)
    # This new line ensures 'tags' is serialized as a proper JSON array
    tags = serializers.ListField(child=serializers.CharField()) 
    class Meta:
        model = Problem
        fields = ['id', 'title', 'description', 'difficulty', 'tags', 'time_limit', 'memory_limit', 'author', 'created_at', 'test_cases']

class SubmissionSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    problem = serializers.ReadOnlyField(source='problem.title')
    class Meta:
        model = Submission
        fields = ['id', 'problem', 'user', 'code', 'language', 'verdict', 'execution_time', 'memory_used', 'submitted_at', 'ai_feedback']



class ContestSerializer(serializers.ModelSerializer):
    problems = ProblemSerializer(many=True, read_only=True)
    class Meta:
        model = Contest
        fields = '__all__'

class ContestParticipantSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = ContestParticipant
        fields = '__all__'