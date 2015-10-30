package morel.dqmsl.party;

import java.io.IOException;
import java.util.Map;

import morel.dqmsl.party.data.JsonFileSkillDao;

public class SkillSync {

	public static void main(String[] args) throws IOException {
		SkillSync sync = new SkillSync();;
		sync.syncSkills();
		sync.syncCharacteristcs();
	}

	private void syncCharacteristcs() throws IOException {
		SkillFetcher fetcher = new SkillFetcher();
		Map<String, String> chars = fetcher.fetchCharacteristics();
		JsonFileSkillDao dao = new JsonFileSkillDao();
		dao.saveCharacteristics(chars);
	}

	private void syncSkills() throws IOException {
		SkillFetcher fetcher = new SkillFetcher();
		Map<String, String> skills = fetcher.fetchSkills();
		JsonFileSkillDao dao = new JsonFileSkillDao();
		dao.saveSkill(skills);
	}
}
