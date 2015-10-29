package morel.dqmsl.party.data;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Map;

import com.cedarsoftware.util.io.JsonWriter;

public class JsonFileSkillDao {

	public void saveSkill(Map skills) throws IOException {
		String json = JsonWriter.objectToJson(skills);
		FileWriter fw = new FileWriter(new File("./data/skills.json"));
		fw.write(json);
		fw.flush();
		fw.close();
	}
	
}
