package morel.dqmsl.party.data;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;

import morel.dqmsl.party.model.Monster;

import org.apache.commons.io.IOUtils;

import com.cedarsoftware.util.io.JsonReader;
import com.cedarsoftware.util.io.JsonWriter;

public class JsonFileMonsterDao {

	public Monster getMonster(int no) throws FileNotFoundException, IOException {
		File f = new File("./data/monster-" + no + ".json");
		if (!f.exists()) {
			System.out.println("file not found for no:" + no);
			return null;
		}
		
		return (Monster) JsonReader.jsonToJava(IOUtils.toString(new FileInputStream(f)));
	}
	
	public void saveMonster(Monster m) throws IOException {
		String json = JsonWriter.objectToJson(m);
		FileWriter fw = new FileWriter(new File("./data/monster-" + m.getNo() + ".json"));
		fw.write(json);
		fw.flush();
		fw.close();
	}
}
