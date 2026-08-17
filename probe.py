import asyncio
from datetime import date, time
from starlette.requests import Request
import app.main as main

class FakeCursor:
    def __init__(self):
        self.executed=[]
    def execute(self, query, params=None):
        self.executed.append((query, params))
    def fetchone(self):
        q=self.executed[-1][0]
        if 'FROM leave_report' in q:
            return (5,2)
        if 'FROM ticket_table' in q and 'COUNT(*)' in q:
            return (1,)
        if 'FROM ticket_table' in q and 'TOP 1' in q:
            return (101,'Ticket Title','alice','Desc',date(2026,7,1))
        if 'FROM user_table' in q:
            return ('avatar.png',)
        return None
    def fetchall(self):
        q=self.executed[-1][0]
        if 'SELECT overtime_date, daily_overtime, status, description FROM ezafe_table' in q:
            return [(date(2026,7,2), time(1,30),'????? ???','desc')]
        if 'SELECT daily_overtime FROM ezafe_table' in q:
            return [(time(1,30),)]
        if 'FROM ticket_table' in q and 'WHERE username = ? OR target_username = ?' in q:
            return [(1,'Ticket Title','Desc','alice','????? ???',date(2026,7,1),0)]
        if 'SELECT request_date, pass_title, pass_duration, status FROM totalpass_table' in q:
            return [(date(2026,7,3),'pass title',time(1,0),'????? ???')]
        if 'SELECT pass_duration FROM totalpass_table WHERE username = ? AND status = \'????? ???\'' in q:
            return [(time(0,30),)]
        if 'SELECT pass_duration FROM totalpass_table' in q and "status = N'????? ???'" in q:
            return [(time(0,30),)]
        if 'FROM mrkhc_table' in q:
            return [(date(2026,7,4), date(2026,7,6), 3, '????? ???')]
        return []

main.cursor = FakeCursor(); main.templates.TemplateResponse = lambda request,name,context: {'template':name,'context':context}
request = Request({"type": "http", "method": "GET", "path": "/user_panel", "headers": [], "session": {"username": "alice"}})
response = asyncio.run(main.user_panel(request))
print(response['template'])
print(response['context']['leave_details'])
print(response['context']['leave_details'][0]['status'])
print(repr(response['context']['leave_details'][0]['status']))
print(response['context']['leave_details'][0]['days'])
