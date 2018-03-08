using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

/// <summary>
/// Summary description for WebService
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class WebService : System.Web.Services.WebService
{
    //string LocalConStr = ConfigurationManager.ConnectionStrings["LocalConn"].ConnectionString;
    //string LiveDNSIP = ConfigurationManager.ConnectionStrings["LiveConStrIP"].ConnectionString;
    //string LiveDNSStr = ConfigurationManager.ConnectionStrings["LiveConStrAddress"].ConnectionString;

    string LiveDNSIP = "Server=62.219.78.210;Database=site14;Uid=site14;Password=zxc14;";//for computer
    string LiveDNSStr = "Server=sql7.livehosting.local;Database=site14;Uid=site14;Password=zxc14;";//for application

    SqlConnection conn;
    SqlCommand comm;
    SqlDataAdapter da;
    DataTable dt;

    public WebService()
    {
        conn = new SqlConnection(LiveDNSIP);
        comm = new SqlCommand("", conn);
        dt = new DataTable();
    }

    public string RunSql(string StoredProc)
    {
        return RunSql(StoredProc, null);
    }

        public string RunSql(string StoredProc, SqlParameter[] parametrs)
    {
        comm.CommandText = StoredProc;
        comm.CommandType = System.Data.CommandType.StoredProcedure;
        if (parametrs != null)
        {
            foreach (var par in parametrs)
            {
                comm.Parameters.Add(par);
            }
        }
        try
        {
            comm.Connection.Open();
        }
        catch(Exception ex)
        {
            return ex.Message;
        }
        
        da = new SqlDataAdapter(comm);
        da.Fill(dt);
        comm.Connection.Close();
        da.Dispose();
        comm.Parameters.Clear();
        return DataTableToJSONWithStringBuilder(dt);
    }

    [WebMethod]
    public string GetMyMessages(int userid)
    {
        return RunSql("Get_MyMessage", new SqlParameter[] { new SqlParameter("@ID", userid) });
    }

    [WebMethod]
    public string GetMessagesCounter(int userid)
    {
        //output = RunSql("getMessagesCounter", new SqlParameter[] { new SqlParameter("@ID", userid) });
        comm.CommandText = "getMessagesCounter";
        comm.CommandType = System.Data.CommandType.StoredProcedure;
        comm.Parameters.Add(new SqlParameter("@ID", userid));
        try
        {
            comm.Connection.Open();
        }
        catch (Exception ex)
        {
            return ex.Message;
        }

        da = new SqlDataAdapter(comm);
        da.Fill(dt);
        comm.Connection.Close();
        da.Dispose();
        comm.Parameters.Clear();
        return dt.Rows[0][0].ToString();
    }


    [WebMethod]
    public string deleteStage(int id)
    {
        return RunSql("Delete_Stage", new SqlParameter[] { new SqlParameter("@ID", id) });
    }

    [WebMethod]
    public string GetStagesByQuest(int id)
    {
        return RunSql("Get_StagesByQuest", new SqlParameter[] { new SqlParameter("@ID", id) });
    }


    [WebMethod]
    public string SendMsg(int userid, int friendid, string text)
    {
        return RunSql("Send_Message", new SqlParameter[] { new SqlParameter("@userid_sender", userid), new SqlParameter("@userid_receiver", friendid), new SqlParameter("@Text", text) });
    }

    [WebMethod]
    public string GetFriendsRequests(int userid)
    {
        return RunSql("Get_FriendRequests", new SqlParameter[] { new SqlParameter("@ID", userid) });
    }

    [WebMethod]
    public string UpdateRead(int userid, int friendid)
    {
        return RunSql("UpdateRead", new SqlParameter[] { new SqlParameter("@ID", userid), new SqlParameter("@FriendID", friendid) });
    }

    [WebMethod]
    public string FindFriends(int userid, string text)
    {
        return RunSql("Find_Friend", new SqlParameter[] { new SqlParameter("@ID", userid), new SqlParameter("@Text", text) });
    }

    [WebMethod]
    public string AddFriend(int userid, int requestid)
    {
        return RunSql("Add_Friend", new SqlParameter[] { new SqlParameter("@senderID", userid), new SqlParameter("@requestID", requestid) });
    }

    [WebMethod]
    public string ConfirmRemoveRequest(int userid, int requestid, int flag)
    {
        return RunSql("ConfirmRemove_FriendRequest", new SqlParameter[] { new SqlParameter("@senderID", userid), new SqlParameter("@requestID", requestid), new SqlParameter("@Flag", flag) });
    }


    [WebMethod]
    public string addNewStage(string name, int number, string longt, string lat, string question, string answer, string hint, int? isend, int qid)
    {
        return RunSql("Add_NewStage", new SqlParameter[] { new SqlParameter("@Riddle", question), new SqlParameter("@Hint", hint), new SqlParameter("@StageNumber", number), new SqlParameter("@StageName", name), new SqlParameter("@StageLong", longt), new SqlParameter("@StageLat", lat), new SqlParameter("@Answer", answer), new SqlParameter("@IsEnd", isend), new SqlParameter("@QuestID", qid) });
    }

    [WebMethod]
    public string Get_My_Quests(int id)
    {
        return RunSql("GetMyQuests", new SqlParameter[] { new SqlParameter("@USER_ID", id) });
    }

    [WebMethod]
    public string DeleteFriend(int userid, int friendid)
    {
        return RunSql("Delete_Friend", new SqlParameter[] { new SqlParameter("@UserID", userid), new SqlParameter("@FriendID", friendid) });
    }

    [WebMethod]
    public string DeleteNews(int id)
    {
        return RunSql("Delete_Post", new SqlParameter[] { new SqlParameter("@ID", id) });
    }

    [WebMethod]
    public string GetFilters()
    {
        return RunSql("Get_DifficultyDesc");
    }

    [WebMethod]
    public string DeleteQuest(int id)
    {
        return RunSql("Delete_Quest", new SqlParameter[] { new SqlParameter("@ID", id) });
    }

    [WebMethod]
    public string GetMyFriends(string userid)
    {
        return RunSql("Get_MyFriends", new SqlParameter[] { new SqlParameter("@UserID", userid) });
    }

    [WebMethod]
    public string User_Reg(string username, string firstname, string lastname, string email, string password)
    {
        return RunSql("User_Register", new SqlParameter[] { new SqlParameter("@User_Name", username), new SqlParameter("@First_Name", firstname), new SqlParameter("@Last_Name", lastname), new SqlParameter("@Email", email), new SqlParameter("@Password", password) });
    }

    [WebMethod]
    public string AdminGetUsers()
    {
        return RunSql("Get_UsersTB");
    }

[WebMethod]
    public string Update_Profile(string userid, string firstname, string lastname, string email, string password)
    {
        return RunSql("Update_UserDetails", new SqlParameter[] { new SqlParameter("@User_ID", userid), new SqlParameter("@First_Name", firstname), new SqlParameter("@Last_Name", lastname), new SqlParameter("@Email", email), new SqlParameter("@PWD", password) });
    }

    [WebMethod]
    public string Login(string username, string password)
    {
        return RunSql("spLogin", new SqlParameter[] { new SqlParameter("@username", username), new SqlParameter("@pass", password) });
    }

    [WebMethod]
    public string CheckAnswer(string userid, string questid)
    {
        return RunSql("CheckCurrectPlace", new SqlParameter[] { new SqlParameter("@UserID", userid), new SqlParameter("@QuestID", questid) });
    }

    [WebMethod]
    public string GetNews()
    {
        return RunSql("Get_News");
    }



    [WebMethod]
    public string AddNewQuest(string name, string location, string desc, string diff)
    {
        return RunSql("Add_NewQuest", new SqlParameter[] { new SqlParameter("@questname", name), new SqlParameter("@locationname", location), new SqlParameter("@difficulty", diff), new SqlParameter("@questdescription", desc) });
    }


    [WebMethod]
    public string UpdateBO(string value, string field, int id, string table)
    {
        switch(field)
        {
            case "username":
                field = "@Username";
                break;
            case "pass":
                field = "@Pwd";
                break;
            case "rank":
                field = "@Rank";
                break;
            case "topic":
                field = "@Topic";
                break;
            case "contect":
                field = "@Contect";
                break;
            case "qname":
                field = "@Name";
                break;
            case "qlname":
                field = "@Location";
                break;
            case "qdif":
                field = "@Dif";
                break;
            case "qdesc":
                field = "@Desc";
                break;
            case "sname":
                field = "@StageName";
                break;
            case "snum":
                field = "@StageNumber";
                break;
            case "slong":
                field = "@StageLong";
                break;
            case "slat":
                field = "@StageLat";
                break;
            case "srid":
                field = "@Riddle";
                break;
            case "sanswer":
                field = "@Answer";
                break;
            case "shint":
                field = "@Hint";
                break;
            case "siend":
                field = "@IsEnd";
                break;
            case "qactive":
                field = "@isActive";
                break;
            default: break;
        }
        switch(table)
        {
            case "users":
                table = "Update_Users";
                break;
            case "news":
                table = "Update_News";
                break;
            case "quests":
                table = "Update_QuestDetails";
                break;
            case "stages":
                table = "Update_StageDetails";
                break;
            default:break;
        }
        return RunSql(table, new SqlParameter[] { new SqlParameter("@ID", id), new SqlParameter(field, value)});
    }

    [WebMethod]
    public string UsersInQuest(string userid, string questid, string stageid)
    {
        return RunSql("UpdateUserInQuest", new SqlParameter[] { new SqlParameter("@User_ID", userid), new SqlParameter("@Quest_ID", questid), new SqlParameter("@Stage_ID", stageid) });
    }

    [WebMethod]
    public string AddNewPost(string user, string topic, string content)
    {
        return RunSql("Add_NewPost", new SqlParameter[] { new SqlParameter("@UserName", user), new SqlParameter("@Content", content), new SqlParameter("@Topic", topic) });
    }

    [WebMethod]
    public string DeleteUser(int id)
    {
        return RunSql("Delete_User", new SqlParameter[] { new SqlParameter("@ID", id) });
    }

    [WebMethod]
    public string GetProfile(string username)
    {
        return RunSql("Get_Profile", new SqlParameter[] { new SqlParameter("@username", username) });
    }


    [WebMethod]
    public string GetQuests(int id)
    {
        return RunSql("Get_Quests", new SqlParameter[] { new SqlParameter("@UserID", id) });
    }

    [WebMethod]
    public string GetQuestsBo()
    {
        return RunSql("Get_QuestsBo");
    }


    [WebMethod]
    public string GetQuestFirstLoc(int questid)
    {
        return RunSql("spGetQuestLoc", new SqlParameter[] { new SqlParameter("@questid", questid) });
    }

    public string DataTableToJSONWithStringBuilder(DataTable table)
    {
        var JSONString = new StringBuilder();
        if (table.Rows.Count > 0)
        {
            JSONString.Append("[");
            for (int i = 0; i < table.Rows.Count; i++)
            {
                JSONString.Append("{");
                for (int j = 0; j < table.Columns.Count; j++)
                {
                    if (j < table.Columns.Count - 1)
                    {
                        JSONString.Append("\"" + table.Columns[j].ColumnName.ToString() + "\":" + "\"" + table.Rows[i][j].ToString() + "\",");
                    }
                    else if (j == table.Columns.Count - 1)
                    {
                        JSONString.Append("\"" + table.Columns[j].ColumnName.ToString() + "\":" + "\"" + table.Rows[i][j].ToString() + "\"");
                    }
                }
                if (i == table.Rows.Count - 1)
                {
                    JSONString.Append("}");
                }
                else
                {
                    JSONString.Append("},");
                }
            }
            JSONString.Append("]");
        }
        return JSONString.ToString();
    }
}

class User
{
    public string Username{get;set;}
    public string Password { get; set; }
}

