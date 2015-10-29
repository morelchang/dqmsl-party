package morel.dqmsl.party.parser;

import java.util.Map;
import java.util.TreeMap;

import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class SkillParser {

	public Map<String, String> parse(Document doc) {
		Elements skills = doc.select("span.skillButton");
		Map<String, String> result = new TreeMap<String, String>();
		for (Element e : skills) {
			result.put(e.attr("code"), e.text());
		}
		return result;
	}

}
