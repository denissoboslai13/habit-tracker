from datetime import timedelta

def calculate_longest(logs):
    if not logs:
        return []

    longest_streak = []
    current_streak = []
    previous_date = None

    for log in logs:
        if not log["completed"]:
            current_streak = []
            previous_date = log["date"]
            continue

        if previous_date is None or log["date"] == previous_date + timedelta(days=1):
            current_streak.append(log)
        else:
            current_streak = [log]

        if len(current_streak) > len(longest_streak):
            longest_streak = current_streak

        previous_date = log["date"]

    return longest_streak